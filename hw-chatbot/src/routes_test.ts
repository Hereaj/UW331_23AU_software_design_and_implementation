import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { chat, save, load, resetTranscriptsForTesting } from './routes';


describe('routes', function() {

  it('chat', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {}});
    const res1 = httpMocks.createResponse();
    chat(req1, res1);
  
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "message" was missing');

    // Second branch, straight line code
    const req2 = httpMocks.createRequest({method: 'GET', url: '/',
        query: {message: "I hate computers."}});
    const res2 = httpMocks.createResponse();
    chat(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(),
        {response: "Do computers worry you?"});

    const req3 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {message: "Are you alive"}});
    const res3 = httpMocks.createResponse();
    chat(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(),
        {response: "Why are you interested in whether I am alive or not?"});

  });

  it('save', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {replaced: false});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {replaced: true});

    resetTranscriptsForTesting();
  });

  it('load', function() {

    // Test case for missing "name" query parameter
    const req1 = httpMocks.createRequest({ method: 'GET', url: '/', query: {} });
    const res1 = httpMocks.createResponse();
    load(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');

    // Test case for a valid "name" query parameter with a non-existing transcript
    const req2 = httpMocks.createRequest({ method: 'GET', url: '/', query: { name: "NonExisting" } });
    const res2 = httpMocks.createResponse();
    load(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "name" was missing');

    // Test case for a valid "name" query parameter with an existing transcript
    const saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "B", value: "some content" } });
    const saveRes3 = httpMocks.createResponse();
    save(saveReq3, saveRes3);

    const req3 = httpMocks.createRequest({ method: 'GET', url: '/', query: { name: "B" } });
    const res3 = httpMocks.createResponse();
    load(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), { value: "some content" });

    const saveReq4 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "AJ", value: "331 is hard but how about 332?" } });
    const saveRes4 = httpMocks.createResponse();
    save(saveReq4, saveRes4);

    const req4 = httpMocks.createRequest({ method: 'GET', url: '/', query: { name: "AJ" } });
    const res4 = httpMocks.createResponse();
    load(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), { value: "331 is hard but how about 332?" });

    // Reset transcripts for testing
    resetTranscriptsForTesting();
  });

});
