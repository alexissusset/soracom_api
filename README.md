# About soracom_api

## install
npm install soracom_api

## how to use
"authKey" and "token" are checked automatically in this API.

### authorization
The API supports the both of authorization methods: email/password and authKey and secret.

```
var soracom = new Soracom({email: 'mail address',password:'password'});
```
```
var soracom = new Soracom({authKeyId: 'keyId',authKey:'secret'});
```
```
var soracom = new Soracom({userName:'user name',password:'password',operatorId:'Operator ID'}); // SAM User login
```

When this API accesses SORACOM service, it takes authKey and token automatically.

### get information of SIM

```
var Soracom = require('soracom_api');
var soracom = new Soracom({email: 'mail address',password:'password'});
soracom.get('/subscribers',function(err,res){
  console.log({err:err,res:res});
});
```

### set name into SIM

```
var Soracom = require('soracom_api');
var soracom = new Soracom({authKeyId: 'keyId',authKey:'secret'});
soracom.put('/subscribers/imsi/tags',[
  {
    "tagName": "name",
    "tagValue": "my_test_sim"
  }
],function(err,res){
  console.log({err:err,res:res});
});

```

## API
### soracom.get('path',function(err,res){ callback });
parameters:
 - path:  request path
return:
 - err: error message
 - res: response

### soracom.post('path',params,function(err,res){ callback });
- parameters:
 - path:  request path
 - params: request body. it can be omitted.
- return:
 - err: error message
 - res: response

### soracom.put('path',params,function(err,res){ callback });
- parameters:
 - path:  request path
 - params: request body. it can be omitted.

- return:
 - err: error message
 - res: response

### soracom.delete('path',params,function(err,res){ callback });
- parameters:
 - path:  request path
 - params: request body. it can be omitted.
- return:
 - err: error message
 - res: response
