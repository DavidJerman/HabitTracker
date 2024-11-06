const request = require('supertest');
const app = `http://localhost:${process.env.SERVER_PORT}`;

const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const generateCredentials = () => {
    const username = `testuser_${generateRandomString(5)}`;
    const password = generateRandomString(8);
    const email = `${generateRandomString(8)}@mail.com`;

    return {username, password, email};
}

describe('Activities API', () => {
    let token;

    beforeAll(async () => {
        const {username, password, email} = generateCredentials();

        await request(app)
            .post('/auth/register')
            .send({username, password, email});

        const response = await request(app)
            .post('/auth/login')
            .send({username, password});

        token = response.body.token;

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    describe('POST /activity/add', () => {
        it('should add a new activity', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Activity added successfully');
        });

        it('should add two activities', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity 1',
                    description: 'Test description 1',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Activity added successfully');

            const response2 = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity 2',
                    description: 'Test description 2',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response2.status).toBe(201);
            expect(response2.body).toHaveProperty('message', 'Activity added successfully');
        });

        it('should add multiple activities', async () => {
            for (let i = 0; i < 5; i++) {
                const response = await request(app)
                    .post('/activity/add')
                    .send({
                        token,
                        name: `Test activity ${i}`,
                        description: `Test description ${i}`,
                        activityType: 'running',
                        dateAdded: "2021-01-01",
                        duration: 60,
                        distance: 5,
                        calories: 300,
                        elevationGain: 100
                    });

                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message', 'Activity added successfully');
            }
        });

        it('should return an error for missing name', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Activity name is required');
        });

        it('should return an error for missing activity type', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Activity type must be \'running\', \'cycling\', \'swimming\', \'walking\', \'hiking\', \'yoga\', \'weightlifting\', or \'other\'');
        });

        it('should return an error for missing duration', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Activity duration is required');
        });

        it('should return an error for invalid activity type', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'invalid',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Activity type must be \'running\', \'cycling\', \'swimming\', \'walking\', \'hiking\', \'yoga\', \'weightlifting\', or \'other\'');
        });

        it('should return an error for invalid date', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "invalid",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid date format');
        });

        it('should return an error for invalid duration', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 'invalid',
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid duration');
        });

        it('should return an error for invalid distance', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 'invalid',
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid distance');
        });

        it('should return an error for invalid calories', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 'invalid',
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid calories');
        });

        it('should return an error for invalid elevation gain', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 'invalid'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid elevation gain');
        });

        it('should return an error for missing distance when activity type is cycling', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'cycling',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Distance is required for this activity type');
        });

        it('should return an error for missing distance when activity type is walking', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'walking',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Distance is required for this activity type');
        });

        it('should return an error for missing distance when activity type is hiking', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'hiking',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Distance is required for this activity type');
        });

        it('should return an error for missing distance when activity type is running', async () => {
            const response = await request(app)
                .post('/activity/add')
                .send({
                    token,
                    name: 'Test activity',
                    description: 'Test description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Distance is required for this activity type');
        });
    });

    describe('POST /activity/get', () => {
        beforeAll(async () => {
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post('/activity/add')
                    .send({
                        token,
                        name: `Test activity ${i}`,
                        description: `Test description ${i}`,
                        activityType: 'running',
                        dateAdded: "2021-01-01",
                        duration: 60,
                        distance: 5,
                        calories: 300,
                        elevationGain: 100
                    });
            }
        });

        it('should get all activities', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({token});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        activityType: 'running'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with multiple filters', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        activityType: 'running',
                        distanceGreaterThan: 4
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with date filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        dateAdded: "2021-01-01"
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with multiple date filters', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        dateAdded: "2021-01-01",
                        activityType: 'running'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with date after filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        dateAddedAfter: "2021-01-01"
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with date before filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        dateAddedBefore: "2021-01-01"
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with date range filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        dateAddedAfter: "2021-01-01",
                        dateAddedBefore: "2021-01-02"
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with name filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        name: 'Test activity 1'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with description filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        description: 'Test description 1'
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with distance filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        distanceLessThan: 6
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with calories filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        caloriesGreaterThan: 200
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with elevation gain filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        elevationGainGreaterThan: 50
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with duration filter', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        durationGreaterThan: 50
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });

        it('should get activities with multiple filters', async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({
                    token,
                    filter: {
                        distanceGreaterThan: 4,
                        caloriesGreaterThan: 200
                    }
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('activities');
        });
    });

    describe('POST /activity/update', () => {
        let activityId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/activity/get')
                .send({token});

            activityId = response.body.activities[0]._id;
        });

        it('should update an activity', async () => {
            const response = await request(app)
                .post('/activity/update')
                .send({
                    token,
                    activityId,
                    name: 'Updated activity',
                    description: 'Updated description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Activity updated successfully');
        });

        it('should return an error for missing activity ID', async () => {
            const response = await request(app)
                .post('/activity/update')
                .send({
                    token,
                    name: 'Updated activity',
                    description: 'Updated description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Activity not found');
        });

        it('should return an error for invalid activity ID', async () => {
            const response = await request(app)
                .post('/activity/update')
                .send({
                    token,
                    activityId: 'invalid',
                    name: 'Updated activity',
                    description: 'Updated description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should return an error for missing name', async () => {
            const response = await request(app)
                .post('/activity/update')
                .send({
                    token,
                    activityId,
                    description: 'Updated description',
                    activityType: 'running',
                    dateAdded: "2021-01-01",
                    duration: 60,
                    distance: 5,
                    calories: 300,
                    elevationGain: 100
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Activity name is required');
        });
    });
});
