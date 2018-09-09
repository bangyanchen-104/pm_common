class RequestDispatcher 
{
    static get scheduler()
    {
        return Utils.getVariable( "Scheduler" );
    }

    static set scheduler( settingObj )
    {
        Utils.setVariable( "Scheduler", settingObj );
    }

    static setNextRequest( nextRequestName ) {
        postman.setNextRequest( nextRequestName );
        console.log( "Next Request : " + nextRequestName );
    }

    static terminate()
    {
        this.setNextRequest( null );
    }

    static schedule( context )
    {
        let nextRequest = "";
        const currentRequestName = context.requestName;

        this.setNextRequest( nextRequest );
    }
    
    static repeatedRequest( testContext, expectedTimes, nextRequestName ) 
    {
        const requestId = testContext.requestId; // requestId 當作 key, 執行次數為 value
        let currentRepeatedTimes = this.getRepetition( testContext ) + 1;

        console.log( "Repeated times : " +  currentRepeatedTimes );
        this._setRepetition( testContext, currentRepeatedTimes );
        
        if ( currentRepeatedTimes < expectedTimes ) {
            this.setNextRequest( testContext.requestName );
        }
        else {
            testContext.removeAttribute( requestId );
            if ( nextRequestName !== undefined ) {
                this.setNextRequest( nextRequestName );
            }
        }
    }

    static getRepetition( testContext ) {
        let repeatedTimes = 0;
        if ( Utils.hasVariable( testContext.requestId ) )
        {
            repeatedTimes = parseInt( Utils.getVariable( testContext.requestId ), 10 ); 
        }
        return repeatedTimes;
    }

    static _setRepetition( testContext, times )
    {
        Utils.setVariable( testContext.requestId, times );
    }

    static setTestCaseRequest(test_case_object) {
        // 存在才會 setNextRequest
        // 判斷順序 Setup > Test > Teardown > NextTest
        console.log(test_case_object)
        let NextReq = null;
        if (test_case_object.Setup.length > 0) {
            NextReq = test_case_object.Setup.shift();
        } else if (test_case_object.Test.length > 0) {
            NextReq = test_case_object.Test.shift();
        } else if (test_case_object.Teardown.length > 0) {
            NextReq = test_case_object.Teardown.shift();
        } else {
            NextReq = test_case_object.NextTest;
        }
        console.log("Next Request : " + NextReq);
        this.setNextRequest(NextReq);
        return test_case_object
    }
}