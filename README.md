# myflix-server
Myflix server using Serverless.

## Response format
JSON response formats as follows.

### Success
```
{
    ok: true,
    result: {
        ...
    }
}
```

### Error
```
{
    ok: false,
    error: {
        reason: "Error description"
    }
}
```





