import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

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

	it('should reject the request if the authorization header is missing', async () => {
		const response = await worker.fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		})

		expect(response.ok).toBe(false)
		expect(response.status).toBe(401)
	})

	it('should reject the request if the authorization header is invalid', async () => {
		const response = await worker.fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer not-a-real-token',
			},
			body: JSON.stringify({}),
		})

		expect(response.ok).toBe(false)
		expect(response.status).toBe(401)
	})

	it('should return an empty response', async () => {
		const payload: Payload = {
			cycle_distance: 0,
			floors_climbed: 0,
			foot_distance: 0,
			hours_slept: 0,
			steps: 0,
			weight: 0,
		}

		const response = await worker.fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer secret',
			},
			body: JSON.stringify(payload),
		})

		expect(response.ok).toBe(true)
		expect(response.status).toBe(200)
	})
})
