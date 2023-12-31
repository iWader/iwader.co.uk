import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { Payload } from './index'

describe('Worker', () => {
	let worker: UnstableDevWorker

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
			ip: '0.0.0.0',
		});
	});

	afterAll(async () => {
		await worker.stop()
	})

	it('should return an empty response', async () => {
		const payload: Payload = {
			cycle_distance: 0,
			floors_climbed: 0,
			foot_distance: 0,
			hours_slept: 0,
			steps: 0,
		}

		const response = await worker.fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		expect(response.ok).toBe(true)
	})
})
