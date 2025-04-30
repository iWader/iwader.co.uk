---
date: "2025-03-13"
title: "File streams with PHP"
excerpt: A brief tutorial on using file streams with PHP
---

File streams allow you to interact with a data source without having to load the whole resource into memory. This avoids hitting memory limits when working with larger files.

Let's look at a basic example of reading a file from disk

```php
// Open the file
$resource = fopen('/path-to-my-file.txt', 'r');

// Read contents into a variable
$contents = stream_get_contents($resource);

// Close the file
fclose($resource);
```

It's important to remember to use `fclose()` once finished with the stream. Otherwise the file descriptor will remain open for the lifetime of the process. PHP will automatically close all file descriptors at the end of the request when using php-fpm or mod_php. However in CLI and other SAPI environments such as swoole, this will leak memory and eventually cause your PHP server to be killed by the OS.

`fopen()` may be used to interact with data from many resources. These include files from disk, http(s), and in-memory storage. For a full list of supported protocols, see the [php documentation](https://www.php.net/manual/en/wrappers.php)

## Modes

You may have noticed the `r` used in the `fopen('/path-to-my-file.txt', 'r')` call. This specifies the type of access you need to the resource.

There are several modes, typically `r` (read) and `w+` (read and write) are the most commonly used. See the [php documentation](https://www.php.net/manual/en/function.fopen.php) on `fopen()` for more information.

## Filters

Filters can be used to modify data when reading or writing to the stream. PHP has several default filters including base64, rot13, upper and lower case transforms. You may also register your own custom filters.

```php
// File contains: VGhpcyBpcyBteSBzdHJpbmc=
$stream = fopen('/a-base64-encoded-file.txt');

stream_filter_append($stream, 'convert.base64-decode', STREAM_FILTER_READ);

// Output: This is my string
print stream_get_contents($stream);

fclose($stream);
```

You can also use filters to modify data when writing to a stream

```php
$stream = fopen('/my-file.txt');

stream_filter_append($stream, 'string.toupper', STREAM_FILTER_WRITE);

fwrite($stream, 'this is my string');

fclose($stream);

// File contents: THIS IS MY STRING
```

## IO stream aliases

PHP has a number of io stream aliases to easily interact with common resources. These include stdin, stdout, and stderr when in a CLI context, but most useful are the memory buffer and temporary files.

```php
$buffer = fopen('php://memory', 'w+');

$temp = fopen('php://temp', 'w+');

$stdin = fopen('php://stdin', 'r');

$stdout = fopen('php://stdout', 'w+');
```

You can find more about these in the [php documentation](https://www.php.net/manual/en/wrappers.php.php)

## Seeking

So far my examples have shown reading or writing the full file contents, however it is possible to read/write parts of the resource, as well as seek forward and backwards.

The `fseek()` function allows you to move the current cursor position in the file to a specific point. `rewind()` will move the cursor back to the beginning of the resource.

```php
$stream = fopen('my-file.txt', 'r');

// Read first 4kb of data
$data = fgets($stream, 4096);

// Seek back to the beginning of the file. rewind($stream) achieves the same
fseek($stream, 0);
```

Beware! Not all streams seekable and may result in an error when attempting to do so. You should first check your stream is seekable. Non-seekable streams include sockets, pipes, and callback/pump resources.

```php
$stream = fopen('my-file.txt', 'r');

$meta = stream_get_meta_data($stream)['seekable'];

if ($meta['seekable'] === true) {
    rewind($stream);
}

$data = fgets($stream, 4096);
```

## PSR-7 HTTP Message Interfaces

You might be asking "What do HTTP Messages have to do with file streams?". 

While PSR-7 is predominantly about HTTP payloads, the `StreamInterface` provides a simple uniform implementation when working with any file stream.

```php
$resource = fopen('php://temp', 'w+');

$stream = new Stream($resource);

if ($stream->isSeekable()) {
    $stream->seek(0);
}

$data = $stream->read(4096);

$stream->close();
```

There are several PSR-7 implementations, but mostly I use [guzzle/psr-7](https://github.com/guzzle/psr7) as it comes bundled with the guzzle http client.

More details on PSR-7 can be found on the [PHP-FIG website](https://www.php-fig.org/psr/psr-7/)

## Guzzle Utils

The [guzzle/psr-7](https://github.com/guzzle/psr7) library comes with a useful set of utils for interacting with streams. Seeing as it's a PSR-7 implmentation, as you'd expect the streams it can interact with need to be a `StreamInterface`

#### Opening a stream

`Utils::tryFopen()` returns an open stream, or throws an exception. When using `fopen()` directly, this can return false if it failed to open the resource.

```php
$fd = Utils::tryFopen('php://temp', 'w+');
```

#### Instantiate a `StreamInterface` based on input

Creating a `StreamInterface` without knowing the underlying resource can be cumbersom. `Utils::streamFor()` does the heavy lifting for you

```php
Utils::streamFor('a simple string');

Utils::streamFor(Utils::tryFopen('php://temp', 'w+'));

Utils::streamFor($generator);

Utils::streamFor($iterator);
```

#### Copy contents

```php
$source = Utils::streamFor(Utils::tryFopen('/my-large-file.txt'));

$dest = Utils::streamFor(Utils::tryFopen('php://temp', 'w+'));

Utils::copyToStream($source, $dest);
```

## Stream a file to the client browser

If you have a large file you want to send to the client browser, returning this as a string in the http response may cause an out of memory error. To avoid this file streams allow you to read chunks of the file and send them to the client allowing memory to be freed before reading the next chunk.

```php
$fd = fopen('/my-large-file.txt', 'r');

// Read file and pass to the output interface. fpassthru() uses settings from the php.ini to determine chunk size when reading the file
fpassthru($fd);

fclose($fd);
```

Or when in a Laravel controller

```php
return response()->streamDownload(function () {
    $stream = Utils::streamFor(Utils::tryFopen('/my-large-file.txt', 'r'));

    // Check for end of file
    while (!$stream->eof()) {
        // Read 100kb
        $buffer = $stream->read(1024 * 100);

        // Send buffer to output interface
        print $buffer;
    }

    $stream->close();
})
```

## Handling CSVs

File streams are particularly useful when working with CSV files. CSVs often contain large amounts of data and can easily run into memory problems. 

My favourite library for dealing with CSV files is [league/csv](https://github.com/thephpleague/csv).

```php
$csv = <<<EOF
id,name,email
1,Joe,joe@example.com
2,Jane,jane@example.com
EOF;

$reader = Reader::createFromStream(Utils::streamFor($csv));

/** @var array{id: string, name: string, email: string} $record */
foreach ($reader->getRecords() as $record) {
    // Process data
}

$reader->close();
```

The same applies for writing large amounts of data to csv

```php
$stream = Utils::tryFopen('php://temp', 'w+');

$csv = Writer::createFromStream($stream);

foreach ($datasource as $data) {
    $csv->insertOne([
        'id' => $data->getId(),
        'name' => $data->getName(),
        'email' => $data->getEmail(),
    ]);
}

unset($csv);

fclose($stream);
```