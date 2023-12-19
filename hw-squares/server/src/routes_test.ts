import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { save, load, listFiles, resetForTesting } from './routes';


describe('routes', function() {

  // TODO: add tests for your routes
  it('save', function() {
    // First branch, straight line code, error case, where name is undefined
    const req1 = httpMocks.createRequest({method: 'POST', url: '/save', body: {value: 'somthing'}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing.');

    // Second branch, straight line code, error case, where value is undefined
    const req2 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: 'AJ'}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'required argument "value" was missing.');

    // Third branch, straight line code
    const req3 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: 'AJ', value: 'value has not been replaced = original key:value_0'}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {replaced: false});

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save', body: {name: 'AJ', value: 'value has been replaced = replaced key:value_new'}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {replaced: true});

    resetForTesting();
  })

  it('load', function() {
    // save arbitrary keys and values for the test
    const saveReq1 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: 'Jaehyeon', value: 'value1' } });
    const saveRes1 = httpMocks.createResponse();
    save(saveReq1, saveRes1);
    const saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: 'Seohyeon', value: 'value2' } });
    const saveRes2 = httpMocks.createResponse();
    save(saveReq2, saveRes2);
    const saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: 'Twohyeons', value: 'value3' } });
    const saveRes3 = httpMocks.createResponse();
    save(saveReq3, saveRes3);

    // Case for missing "name" query parameter
    const req1 = httpMocks.createRequest({method: 'GET', url: '/load', query:{} });
    const res1 = httpMocks.createResponse();
    load(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing.');

    // Case for missing "name" query parameter with a non-existing name
    const req2 = httpMocks.createRequest({method: 'GET', url: '/load', query:{ name: 'Nobody'} });
    const res2 = httpMocks.createResponse();
    load(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'The given argument name - "Nobody" does not have any values.');
    
    // Test case for a valid "name" query parameter with an existing names
    const req3 = httpMocks.createRequest({method: 'GET', url: '/load', query:{ name: 'Jaehyeon'} });
    const res3 = httpMocks.createResponse();
    load(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), { value: 'value1' });

    const req4 = httpMocks.createRequest({method: 'GET', url: '/load', query:{ name: 'Seohyeon'} });
    const res4 = httpMocks.createResponse();
    load(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), { value: 'value2' });

    resetForTesting();
  })

  it('listFiles', function() {
    // Case for map stored nothing
    const req = httpMocks.createRequest( {method: 'GET', url: '/list', query: {}});
    const res = httpMocks.createResponse();
    listFiles(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), { files: [] });

    // Case for list holding 1 value
    const saveReq1 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: 'Jaehyeon', value: 'value1' } });
    const saveRes1 = httpMocks.createResponse();
    save(saveReq1, saveRes1);
    listFiles(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), { files: ['Jaehyeon'] });

    // Case for list holding more than 1 values
    const saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: 'Seohyeon', value: 'value2' } });
    const saveRes2 = httpMocks.createResponse();
    save(saveReq2, saveRes2);
    listFiles(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), { files: ['Jaehyeon', 'Seohyeon'] });

    const saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: 'Twohyeons', value: 'value3' } });
    const saveRes3 = httpMocks.createResponse();
    save(saveReq3, saveRes3);
    listFiles(req, res);
    assert.strictEqual(res._getStatusCode(), 200);
    assert.deepStrictEqual(res._getData(), { files: ['Jaehyeon', 'Seohyeon', 'Twohyeons'] });

    resetForTesting();
  })
});
