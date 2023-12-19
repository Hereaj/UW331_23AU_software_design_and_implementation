import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addPoll, getPoll, resetForTesting, listPolls, vote, advanceTimeForTesting } from './routes';


describe('routes', function() {

  it('add', function() {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest({method: 'POST', url: '/api/add', body: {}});
    const res1 = httpMocks.createResponse();
    addPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");

    // 2. Missing minutes
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ"}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "'minutes' is not a number: undefined");

    // 3. Invalid minutes
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", minutes: 0}});
    const res3 = httpMocks.createResponse();
    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "'minutes' is not a positive integer: 0");

    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", minutes: 3.5}});
    const res4 = httpMocks.createResponse();
    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "'minutes' is not a positive integer: 3.5");

    // 4. Invalid options
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: "Do forward reasoning", minutes: 4}});
    const res5 = httpMocks.createResponse();
    addPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "'options' must be an array of records with string and number");

    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "Backward Reasoning"}], minutes: 4}});
    const res6 = httpMocks.createResponse();
    addPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(), "'options' must be an array of records with string and number");

    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}], minutes: 4}});
    const res7 = httpMocks.createResponse();
    addPoll(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(), "The length of 'options' must be more than two items");
    
    // Missing total voter count
    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4}});
    const res8 = httpMocks.createResponse();
    addPoll(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(), "'total' must be an number or missing");

    // Invalid total voter count
    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4, total: -1}});
    const res9 = httpMocks.createResponse();
    addPoll(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(), "'total' is not a positive integer: -1");

    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4, total: 3.5}});
    const res10 = httpMocks.createResponse();
    addPoll(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 400);
    assert.deepStrictEqual(res10._getData(), "'total' is not a positive integer: 3.5");
    
    // 5. Correctly added
    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4, total: 20}});
    const res11 = httpMocks.createResponse();
    addPoll(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 200);
    assert.deepStrictEqual(res11._getData().poll.name, "AJ");
    assert.deepStrictEqual(res11._getData().poll.options, [{"option": "no reasoning", "voter": 10}, {"option": "reasoning", "voter": 10}]);
    assert.deepStrictEqual(res11._getData().poll.total, 20);
    const endTime11 = res11._getData().poll.endTime;
    assert.ok(Math.abs(endTime11 - Date.now() - 4 * 60 * 1000) < 50);
    
    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Seohyeon", options: [{option: "breakfirst", voter: 1}, {option: "lunch", voter: 2}, {option: "dinner", voter: 4}], minutes: 7, total: 7}});
    const res12 = httpMocks.createResponse();
    addPoll(req12, res12);
    assert.strictEqual(res12._getStatusCode(), 200);
    assert.deepStrictEqual(res12._getData().poll.name, "Seohyeon");
    assert.deepStrictEqual(res12._getData().poll.options, [{"option": "breakfirst", "voter": 1}, {"option": "lunch", "voter": 2}, {"option": "dinner", "voter": 4}]);
    assert.deepStrictEqual(res12._getData().poll.total, 7);
    const endTime12 = res12._getData().poll.endTime;
    assert.ok(Math.abs(endTime12 - Date.now() - 7 * 60 * 1000) < 50);

    const req13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Twohyeons", options: [{option: "Vancouver", voter: 1}, {option: "Zunich", voter: 2}, {option: "Seoul", voter: 4}, {option: "Seattle", voter: 10}], minutes: 20, total: 17}});
    const res13 = httpMocks.createResponse();
    addPoll(req13, res13);
    assert.strictEqual(res13._getStatusCode(), 200);
    assert.deepStrictEqual(res13._getData().poll.name, "Twohyeons");
    assert.deepStrictEqual(res13._getData().poll.options, [{"option": "Vancouver", "voter": 1}, {"option": "Zunich", "voter": 2}, {"option": "Seoul", "voter": 4}, {"option": "Seattle", "voter": 10}]);
    assert.deepStrictEqual(res13._getData().poll.total, 17);
    const endTime13 = res13._getData().poll.endTime;
    assert.ok(Math.abs(endTime13 - Date.now() - 20 * 60 * 1000) < 50);

    resetForTesting();
  })

  it('getPoll', function() {
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4, total: 20}});
    const res1 = httpMocks.createResponse();
    addPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData().poll.name, "AJ");
    assert.deepStrictEqual(res1._getData().poll.options, [{"option": "no reasoning", "voter": 10}, {"option": "reasoning", "voter": 10}]);
    assert.deepStrictEqual(res1._getData().poll.total, 20);
    const endTime11 = res1._getData().poll.endTime;
    assert.ok(Math.abs(endTime11 - Date.now() - 4 * 60 * 1000) < 50);
    
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Seohyeon", options: [{option: "breakfirst", voter: 1}, {option: "lunch", voter: 2}, {option: "dinner", voter: 4}], minutes: 7, total: 7}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData().poll.name, "Seohyeon");
    assert.deepStrictEqual(res2._getData().poll.options, [{"option": "breakfirst", "voter": 1}, {"option": "lunch", "voter": 2}, {"option": "dinner", "voter": 4}]);
    assert.deepStrictEqual(res2._getData().poll.total, 7);
    const endTime12 = res2._getData().poll.endTime;
    assert.ok(Math.abs(endTime12 - Date.now() - 7 * 60 * 1000) < 50);

    // Separate domain for each branch:
    // 1. Missing name
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/getpoll', body: {}});
    const res3 = httpMocks.createResponse();
    getPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), "missing or invalid 'name' parameter");

    // 2. Invalid name
    const req4 = httpMocks.createRequest(
    {method: 'POST', url: '/api/getpoll',
      body: {name: "Jaehyeon"}});
    const res4 = httpMocks.createResponse();
    getPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "no poll with name 'Jaehyeon'");

    const req5 = httpMocks.createRequest(
    {method: 'POST', url: '/api/getpoll',
      body: {name: "Carlos"}});
    const res5 = httpMocks.createResponse();
    getPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "no poll with name 'Carlos'");

    // 3. Poll found
    const req6 = httpMocks.createRequest({method: 'POST', url: '/api/getpoll', body: {name: "AJ"}});
    const res6 = httpMocks.createResponse();
    getPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData().poll.name, "AJ");
    assert.deepStrictEqual(res6._getData().poll.options, [{"option": "no reasoning", "voter": 10}, {"option": "reasoning", "voter": 10}]);
    assert.deepStrictEqual(res6._getData().poll.total, 20);

    const req7 = httpMocks.createRequest({method: 'POST', url: '/api/getpoll', body: {name: "Seohyeon"}});
    const res7 = httpMocks.createResponse();
    getPoll(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().poll.name, "Seohyeon");
    assert.deepStrictEqual(res7._getData().poll.options, [{"option": "breakfirst", "voter": 1}, {"option": "lunch", "voter": 2}, {"option": "dinner", "voter": 4}]);
    assert.deepStrictEqual(res7._getData().poll.total, 7);
  
    resetForTesting();
  })

  it('list', function() {
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    const res1 = httpMocks.createResponse();
    listPolls(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {polls: []});

    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4, total: 20}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData().poll.name, "AJ");
    assert.deepStrictEqual(res2._getData().poll.options, [{"option": "no reasoning", "voter": 10}, {"option": "reasoning", "voter": 10}]);
    assert.deepStrictEqual(res2._getData().poll.total, 20);

    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Seohyeon", options: [{option: "breakfirst", voter: 1}, {option: "lunch", voter: 2}, {option: "dinner", voter: 4}], minutes: 7, total: 7}});
    const res3 = httpMocks.createResponse();
    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData().poll.name, "Seohyeon");
    assert.deepStrictEqual(res3._getData().poll.options, [{"option": "breakfirst", "voter": 1}, {"option": "lunch", "voter": 2}, {"option": "dinner", "voter": 4}]);
    assert.deepStrictEqual(res3._getData().poll.total, 7);

    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Twohyeons", options: [{option: "Vancouver", voter: 1}, {option: "Zunich", voter: 2}, {option: "Seoul", voter: 4}, {option: "Seattle", voter: 10}], minutes: 24, total: 17}});
    const res4 = httpMocks.createResponse();
    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().poll.name, "Twohyeons");
    assert.deepStrictEqual(res4._getData().poll.options, [{"option": "Vancouver", "voter": 1}, {"option": "Zunich", "voter": 2}, {"option": "Seoul", "voter": 4}, {"option": "Seattle", "voter": 10}]);
    assert.deepStrictEqual(res4._getData().poll.total, 17);
    const endTime4 = res4._getData().poll.endTime;
    assert.ok(Math.abs(endTime4 - Date.now() - 24 * 60 * 1000) < 50);

    // NOTE: "AJ" goes first because it finishes sooner
    const req5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    const res5 = httpMocks.createResponse();
    listPolls(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().polls.length, 3);
    assert.deepStrictEqual(res5._getData().polls[0].name, "AJ");
    assert.deepStrictEqual(res5._getData().polls[1].name, "Seohyeon");
    assert.deepStrictEqual(res5._getData().polls[2].name, "Twohyeons");

    // Push time forward by over 5 minutes
    advanceTimeForTesting(5 * 60 * 1000 + 50);
    
    // NOTE: "AJ" goes after because it has finished
    const req6 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    const res6 = httpMocks.createResponse();
    listPolls(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData().polls.length, 3);
    assert.deepStrictEqual(res6._getData().polls[0].name, "Seohyeon");
    assert.deepStrictEqual(res6._getData().polls[1].name, "Twohyeons");
    assert.deepStrictEqual(res6._getData().polls[2].name, "AJ");

    // Push time forward by another 5 minutes
    advanceTimeForTesting(5 * 60 * 1000);
    
    // NOTE: "AJ" stays after because it finished first
    const req7 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    const res7 = httpMocks.createResponse();
    listPolls(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().polls.length, 3);
    assert.deepStrictEqual(res7._getData().polls[0].name, "Twohyeons");
    assert.deepStrictEqual(res7._getData().polls[1].name, "Seohyeon");
    assert.deepStrictEqual(res7._getData().polls[2].name, "AJ");

    // Push time forward by another 20 minutes (all are completed)
    advanceTimeForTesting(20 * 60 * 1000);
    
    // NOTE: "AJ" stays after because it finished first then "Seohyeon" stays second after because it finished second.
    const req8 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list', query: {}});
    const res8 = httpMocks.createResponse();
    listPolls(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData().polls.length, 3);
    assert.deepStrictEqual(res8._getData().polls[0].name, "Twohyeons");
    assert.deepStrictEqual(res8._getData().polls[1].name, "Seohyeon");
    assert.deepStrictEqual(res8._getData().polls[2].name, "AJ");

    resetForTesting();
  })

  it ('vote', function() {
    // Separate domain for each branch:
    // 1. Missing voter name
    const req1 = httpMocks.createRequest({method: 'POST', url: '/api/vote', body: {}});
    const res1 = httpMocks.createResponse();
    vote(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), "missing 'voter' parameter");

    // 2. Missing name
    // when voter is not array of record
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote',
       body: {option: "AJ"}});
    const res2 = httpMocks.createResponse();
    vote(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), "missing 'name' parameter");
    
    // Save for voting
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "AJ", options: [{option: "no reasoning", voter: 10}, {option: "reasoning", voter: 10}], minutes: 4, total: 20}});
    const res3 = httpMocks.createResponse();
    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData().poll.name, "AJ");
    assert.deepStrictEqual(res3._getData().poll.options, [{"option": "no reasoning", "voter": 10}, {"option": "reasoning", "voter": 10}]);
    assert.deepStrictEqual(res3._getData().poll.total, 20);
    const endTime3 = res3._getData().poll.endTime;
    assert.ok(Math.abs(endTime3 - Date.now() - 4 * 60 * 1000) < 50);
    
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Seohyeon", options: [{option: "breakfirst", voter: 1}, {option: "lunch", voter: 2}, {option: "dinner", voter: 4}], minutes: 7, total: 7}});
    const res4 = httpMocks.createResponse();
    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().poll.name, "Seohyeon");
    assert.deepStrictEqual(res4._getData().poll.options, [{"option": "breakfirst", "voter": 1}, {"option": "lunch", "voter": 2}, {"option": "dinner", "voter": 4}]);
    assert.deepStrictEqual(res4._getData().poll.total, 7);
    const endTime4 = res4._getData().poll.endTime;
    assert.ok(Math.abs(endTime4 - Date.now() - 7 * 60 * 1000) < 50);

    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add',
       body: {name: "Twohyeons", options: [{option: "Vancouver", voter: 1}, {option: "Zunich", voter: 2}, {option: "Seoul", voter: 4}, {option: "Seattle", voter: 10}], minutes: 20, total: 17}});
    const res5 = httpMocks.createResponse();
    addPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().poll.name, "Twohyeons");
    assert.deepStrictEqual(res5._getData().poll.options, [{"option": "Vancouver", "voter": 1}, {"option": "Zunich", "voter": 2}, {"option": "Seoul", "voter": 4}, {"option": "Seattle", "voter": 10}]);
    assert.deepStrictEqual(res5._getData().poll.total, 17);
    const endTime5 = res5._getData().poll.endTime;
    assert.ok(Math.abs(endTime5 - Date.now() - 20 * 60 * 1000) < 50);

    const req6 = httpMocks.createRequest({method: 'POST', url: '/api/vote', body: {name: "AJ", option: "no reasoning"}});
    const res6 = httpMocks.createResponse();
    vote(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData().poll.options, [{"option": "no reasoning", "voter": 11}, {"option": "reasoning", "voter": 10}]);
    assert.deepStrictEqual(res6._getData().poll.total, 21);
    
    const req7 = httpMocks.createRequest({method: 'POST', url: '/api/vote', body: {name: "AJ", option: "reasoning"}});
    const res7 = httpMocks.createResponse();
    vote(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().poll.options, [{"option": "no reasoning", "voter": 11}, {"option": "reasoning", "voter": 11}]);
    assert.deepStrictEqual(res7._getData().poll.total, 22);

    const req8 = httpMocks.createRequest({method: 'POST', url: '/api/vote', body: {name: "Seohyeon", option: "dinner"}});
    const res8 = httpMocks.createResponse();
    vote(req8, res8);
    assert.deepStrictEqual(res4._getData().poll.options, [{"option": "breakfirst", "voter": 1}, {"option": "lunch", "voter": 2}, {"option": "dinner", "voter": 5}]);
    assert.deepStrictEqual(res4._getData().poll.total, 8);


    const req9 = httpMocks.createRequest({method: 'POST', url: '/api/vote', body: {name: "Twohyeons", option: "Seattle"}});
    const res9 = httpMocks.createResponse();
    vote(req9, res9);
    assert.deepStrictEqual(res9._getData().poll.options, [{"option": "Vancouver", "voter": 1}, {"option": "Zunich", "voter": 2}, {"option": "Seoul", "voter": 4}, {"option": "Seattle", "voter": 11}]);
    assert.deepStrictEqual(res9._getData().poll.total, 18);


    resetForTesting();
  });
});
