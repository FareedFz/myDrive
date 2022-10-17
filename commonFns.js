const fs = require('fs');

const commonFns={

    checkApiTraceDir : function(apiLogPath)
	{
		if (!fs.existsSync(apiLogPath)) {
            fs.mkdirSync(apiLogPath);
        }
		return true;
	},

}
module.exports=commonFns;
	