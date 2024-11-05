const request = require('supertest');
const app = 'http://localhost:3000';

// Function to generate a random string
const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const generateCredentials = () => {
    const username = `testuser_${generateRandomString(5)}`;
    const password = generateRandomString(8);
    const email = `${generateRandomString(8)}@mail.com`;

    return {username, password, email};
}

const generateRandomTask = () => {
    const name = `Task_${generateRandomString(5)}`;
    const recurrence = ['none', 'daily', 'weekly', 'monthly'][Math.floor(Math.random() * 4)];
    const recurringDate = recurrence === 'none' ? '' : '2021-12-31';
    const dueDate = recurrence === 'none' ? '2021-12-31' : '';

    return {name, recurrence, recurringDate, dueDate};
}

describe('Tasks API', () => {
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

    describe('POST /task/add', () => {
        it('should add a new task', async () => {
            const {name, recurrence, recurringDate, dueDate} = generateRandomTask();

            const response = await request(app)
                .post('/task/add')
                .send({token, name, recurrence, recurringDate, dueDate});

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Task added');
        });

        it('should add two tasks', () => {
            const tasks = [generateRandomTask(), generateRandomTask()];

            tasks.forEach(async (task) => {
                const response = await request(app)
                    .post('/task/add')
                    .send({token, ...task});

                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message', 'Task added');
            });
        });

        it('should add multiple tasks', () => {
            const tasks = Array.from({length: 5}, () => generateRandomTask());

            tasks.forEach(async (task) => {
                const response = await request(app)
                    .post('/task/add')
                    .send({token, ...task});

                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('message', 'Task added');
            });
        });

        it('should not add a task with missing parameters', async () => {
            const response = await request(app)
                .post('/task/add')
                .send({token, name: 'Invalid task'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task recurrence must be \'none\', \'daily\', \'weekly\', or \'monthly\'');
        });

        it('should not add a task with invalid recurrence', async () => {
            const response = await request(app)
                .post('/task/add')
                .send({token, name: 'Invalid task', recurrence: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task recurrence must be \'none\', \'daily\', \'weekly\', or \'monthly\'');
        });

        it('should not add a task with invalid recurring date', async () => {
            const response = await request(app)
                .post('/task/add')
                .send({token, name: 'Invalid task', recurrence: 'weekly', recurringDate: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid recurring date format');
        });

        it('should not add a task with invalid due date', async () => {
            const response = await request(app)
                .post('/task/add')
                .send({token, name: 'Invalid task', recurrence: 'none', dueDate: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not add a task with invalid token', async () => {
            const response = await request(app)
                .post('/task/add')
                .send({token: 'invalid', name: 'Invalid task', recurrence: 'none', dueDate: '2021-12-31'});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should not add a task with missing token', async () => {
            const response = await request(app)
                .post('/task/add')
                .send({name: 'Invalid task', recurrence: 'none', dueDate: '2021-12-31'});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized or missing token');
        });
    });

    describe('POST /task/update', () => {
        let taskId;

        beforeAll(async () => {
            const {name, recurrence, recurringDate, dueDate} = generateRandomTask();

            const response = await request(app)
                .post('/task/add')
                .send({token, name, recurrence, recurringDate, dueDate});

            taskId = response.body.taskId;

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Task added');

            const responseGet = await request(app)
                .post('/task/get')
                .send({token, taskId, filter: {name}});

            expect(responseGet.status).toBe(200);
            expect(responseGet.body).toHaveProperty('tasks');

            const task = responseGet.body.tasks[0];
            expect(task).toHaveProperty('name', name);
            expect(task).toHaveProperty('recurrence', recurrence);
            expect(task).toHaveProperty('_id');
            expect(task).toHaveProperty('userId');

            taskId = task._id;
        });

        it('should update a task', async () => {
            const {name, recurrence, recurringDate, dueDate} = generateRandomTask();

            const response = await request(app)
                .post('/task/update')
                .send({token, taskId, name, recurrence, recurringDate, dueDate});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Task updated');
        });

        it('should not update a task with invalid recurrence', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token, taskId, name: 'Invalid task', recurrence: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task recurrence must be \'none\', \'daily\', \'weekly\', or \'monthly\'');
        });

        it('should not update a task with invalid recurring date', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token, taskId, name: 'Invalid task', recurrence: 'weekly', recurringDate: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Invalid recurring date format');
        });

        it('should not update a task with invalid due date', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token, taskId, name: 'Invalid task', recurrence: 'none', dueDate: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not update a task with invalid token', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token: 'invalid', taskId, name: 'Invalid task', recurrence: 'none', dueDate: '2021-12-31'});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should not update a task with missing token', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({taskId, name: 'Invalid task', recurrence: 'none', dueDate: '2021-12-31'});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized or missing token');
        });

        it('should not update a task with missing parameters (nothing changes)', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token, taskId});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Task updated');
        });

        it('should not update a task with invalid task ID', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token, taskId: 'invalid', name: 'Invalid task', recurrence: 'none', dueDate: '2021-12-31'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not update a task with missing task ID', async () => {
            const response = await request(app)
                .post('/task/update')
                .send({token, name: 'Invalid task', recurrence: 'none', dueDate: '2021-12-31'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task ID is required');
        });
    });

    describe('POST /task/delete', () => {
        let taskId;

        beforeAll(async () => {
            const {name, recurrence, recurringDate, dueDate} = generateRandomTask();

            const response = await request(app)
                .post('/task/add')
                .send({token, name, recurrence, recurringDate, dueDate});

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Task added');

            const responseGet = await request(app)
                .post('/task/get')
                .send({token, taskId, filter: {name}});

            expect(responseGet.status).toBe(200);
            expect(responseGet.body).toHaveProperty('tasks');

            const task = responseGet.body.tasks[0];
            expect(task).toHaveProperty('name', name);
            expect(task).toHaveProperty('recurrence', recurrence);
            expect(task).toHaveProperty('_id');
            expect(task).toHaveProperty('userId');

            taskId = task._id;
        });

        it('should delete a task', async () => {
            const response = await request(app)
                .post('/task/delete')
                .send({token, taskId});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Task deleted');
        });

        it('should not delete a task with invalid task ID', async () => {
            const response = await request(app)
                .post('/task/delete')
                .send({token, taskId: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not delete a task with missing task ID', async () => {
            const response = await request(app)
                .post('/task/delete')
                .send({token});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task ID is required');
        });

        it('should not delete a task with invalid token', async () => {
            const response = await request(app)
                .post('/task/delete')
                .send({token: 'invalid', taskId});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should not delete a task with missing token', async () => {
            const response = await request(app)
                .post('/task/delete')
                .send({taskId});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized or missing token');
        });
    });

    describe('POST /task/get', () => {
        let taskId;

        beforeAll(async () => {
            let {name} = generateRandomTask();
            const recurrence = 'daily';
            const recurringDate = '2021-12-20';
            const dueDate = '2021-12-31';

            const response = await request(app)
                .post('/task/add')
                .send({token, name, recurrence, recurringDate, dueDate});

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Task added');
        });

        it('should get a task', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
        });

        it('should get a task by name', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {name: 'Task'}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
        });

        it('should get a task by recurrence', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {recurrence: 'daily'}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
        });

        it('should get a task by completion status', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {completed: true}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
        });

        it('should get a task by due date', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {dueDateBefore: '2021-12-31'}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
        });

        it('should not get a task with invalid token', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token: 'invalid'});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should not get a task with missing token', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({taskId});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized or missing token');
        });

        it('should not get a task with a date later than the current date', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {dueDateAfter: '2022-12-31'}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
            expect(response.body.tasks.length).toBe(0);
        });

        it('should not get a task with a date earlier than the current date', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {dueDateBefore: '2020-12-31'}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
            expect(response.body.tasks.length).toBe(0);
        });

        it('should not get a task with a date earlier than the current date and a date later than the current date', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {dueDateBefore: '2020-12-31', dueDateAfter: '2022-12-31'}});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
            expect(response.body.tasks.length).toBe(0);
        });

        it('should not get a task with an invalid date', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {dueDateBefore: 'invalid'}});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not get a task with an invalid date', async () => {
            const response = await request(app)
                .post('/task/get')
                .send({token, filter: {dueDateAfter: 'invalid'}});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });
    });

    describe('POST /task/complete', () => {
        let taskId;

        beforeAll(async () => {
            let {name} = generateRandomTask();
            const recurrence = 'daily';
            const recurringDate = '2021-12-20';
            const dueDate = '2021-12-31';

            const response = await request(app)
                .post('/task/add')
                .send({token, name, recurrence, recurringDate, dueDate});

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Task added');

            const responseGet = await request(app)
                .post('/task/get')
                .send({token, taskId, filter: {name}});

            expect(responseGet.status).toBe(200);
            expect(responseGet.body).toHaveProperty('tasks');

            const task = responseGet.body.tasks[0];
            expect(task).toHaveProperty('name', name);
            expect(task).toHaveProperty('recurrence', recurrence);
            expect(task).toHaveProperty('_id');
            expect(task).toHaveProperty('userId');

            taskId = task._id;
        });

        it('should complete a task', async () => {
            const response = await request(app)
                .post('/task/complete')
                .send({token, taskId});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Task completed');
        });

        it('should not complete a task with invalid task ID', async () => {
            const response = await request(app)
                .post('/task/complete')
                .send({token, taskId: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not complete a task with missing task ID', async () => {
            const response = await request(app)
                .post('/task/complete')
                .send({token});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task ID is required');
        });

        it('should not complete a task with invalid token', async () => {
            const response = await request(app)
                .post('/task/complete')
                .send({token: 'invalid', taskId});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
        });

        it('should not complete a task with missing token', async () => {
            const response = await request(app)
                .post('/task/complete')
                .send({taskId});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized or missing token');
        });
    });

    describe('POST /task/incomplete', () => {
        let taskId;

        beforeAll(async () => {
            let {name} = generateRandomTask();
            const recurrence = 'daily';
            const recurringDate = '2021-12-20';
            const dueDate = '2021-12-31';

            const response = await request(app)
                .post('/task/add')
                .send({token, name, recurrence, recurringDate, dueDate});

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Task added');

            const responseGet = await request(app)
                .post('/task/get')
                .send({token, taskId, filter: {name}});

            expect(responseGet.status).toBe(200);
            expect(responseGet.body).toHaveProperty('tasks');

            const task = responseGet.body.tasks[0];
            expect(task).toHaveProperty('name', name);
            expect(task).toHaveProperty('recurrence', recurrence);
            expect(task).toHaveProperty('_id');
            expect(task).toHaveProperty('userId');

            taskId = task._id;
        });

        it('should mark a task as incomplete', async () => {
            const response = await request(app)
                .post('/task/incomplete')
                .send({token, taskId});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Task incomplete');
        });

        it('should not mark a task as incomplete with invalid task ID', async () => {
            const response = await request(app)
                .post('/task/incomplete')
                .send({token, taskId: 'invalid'});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'An error occurred');
        });

        it('should not mark a task as incomplete with missing task ID', async () => {
            const response = await request(app)
                .post('/task/incomplete')
                .send({token});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Task ID is required');
        });

        it('should not mark a task as incomplete with invalid token', async () => {
            const response = await request(app)
                .post('/task/incomplete')
                .send({token: 'invalid', taskId});

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error', 'Unauthorized');
        });
    });
});
