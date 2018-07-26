class TestTemplate 
{
    constructor() 
    {
        this.context = new TestContext();
        this.testSelector = new TestSelector( this );
        this.testResult = Tests;
        // default expected value
        this.expectedCode = 200;
        this.expectedResponseTime = 5000;
    }

    setUp() {
        console.log("setup : " + this.context.requestName);
    }

    common_tests() {
        let cxt = this.context;
        Tests[ `Http status code : ${ cxt.statusCode }` ] = cxt.statusCode === this.expectedCode;
        Tests[ `Response time : ${ cxt.responseTime } ms` ] = cxt.responseTime <= this.expectedResponseTime;
    }

    run() {
        try {
            this.setUp();
            
            while ( this.testSelector.hasNext() ) 
            {   
                let calleeName = this.testSelector.next();

                if ( this.isCallableFunction( calleeName ) ) 
                {
                    console.log( "Executing : " + calleeName);
                    this[ calleeName ]();
                }
                else {
                    console.log( "unexpected condition : no matched method");
                    this.unexpected();
                }
            }
        }
        catch (error) {
            console.log(error.name);
            console.log(error.message);

            this.testResult.fail();
        }
        finally {
            this.tearDown();
            if ( this.testResult )
            {
                this.testResult.output();
            }   
        }
    }

    unexpected() {
        Tests[ "unexpected condition. " + this.context ] = false;
    }

    tearDown() {
        console.log("tear down : " + this.context.requestName);
        if ( this.context.autoClear )
        {
            this.context.clearAttributes();
        }
    }

    isCallableFunction( calleeName )
    {
        return ( calleeName in this ) && ( typeof this[ calleeName ] === "function" );
    }
}