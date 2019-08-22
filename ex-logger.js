const ExceptionLogger = function(value) {
    if(Array.isArray(value) && value.length === 1 && detectInvalidError(value)) {
        this.exceptions.set(value.type, value.message);
    } else if(Array.isArray(value) && value.length > 0) {
        for(let iError = 0; iError < value.length; ++iError) {
            if(detectInvalidError(value[iError])) {
                this.exceptions.set(value[iError].type, value[iError].message);
            }
        }
    } else if(value instanceof ExceptionLogger) {
        this.exceptions = value.exceptions;
    } else { }
};

// set the type
ExceptionLogger.constructor.name = 'logger';

//
ExceptionLogger.prototype = {
    exceptions: { 
        types: { },
        get: function(name) {
            return this.exceptions.types[name];
        },
        set: function(name, callback) {
            this.exceptions.types[name] = callback(name);
        }
    },
    // TODO: USEFUL?
    // assertStream: function(stringValue='', callback=()=>{}) {
    //     for(const char of stringValue) {
    //         if(!callback(char)) { 
    //             return false;
    //         }
    //     }
    //     return true;
    // },
    exists: function(name='') {
        for(const exception of Object.keys(this.exceptions)) {
            if(exception === name) {
                return true;
            }
        }
        return false;
    },
    getError: function(type='') {
        if(!isNullOrEmpty(this.type) || (!isNullOrEmpty(type) &&  isNullOrEmpty(this.type) && type === this.type)) 
            return this.exceptions.get(this.type);
        else return this.exceptions.get(type === this.type ? this.type : type);
    },
    setError: function(name='') {
        if(!this.exists(name)) {
            this.exceptions.set(name, genError);
        } else {
            console.warn('Exception exists given');
        }
    },
    throw: function(exception, message, generate) {
        const isValidException = (type) => {
            for(let validException in this.exceptions) {
                if(type !== validException && isInvalidExceptionName()) {
                    return false;
                }
            }
            return true;
        };
        if(!isNullOrEmpty(exception) && !isNullOrEmpty(message) && isValidException(exception)) {
            throw new (this.exceptions[error])(message);
        } else if(!isNullOrEmpty(exception) && !isNullOrEmpty(message) && generate) {
            if(!this.exists(exception)) {
                this.setError(exception);
                throw new (this.exceptions[exception])(message);
            } else throw new (this.exceptions[exception](message));
        } else if(!exception && !isNullOrEmpty(this.name) && !isNullOrEmpty(message) && isValiderror(this.name)) {
            throw new (this.exceptions[this.name])(message);
        }
    }
};

//==================================================================
//                         Util Functions                           
//==================================================================

const isNullOrEmpty = (content) => typeof content === 'string' && content === '' || content === null;

const isChar = (digit) => {
    return (typeof digit === 'string' && digit.length === 1) && (digit.toLowerCase() >= 'a' && digit.toLowerCase() <= 'z');
};

const isCharString = (string) => {
    if(!isNullOrEmpty(string)) {
        for(const char of string) {
            if(!isChar(char)) {
                return false;
            }
        }
        return true;
    }
	return false;
};

const isInvalidExceptionName = (string) => {
    const invalid = {
        keywords: ['var', 'let', 'const', 'function', 'Date', 'window', 'document', 'return'],
        specialChars: ['=>', '(', ')','}', ':', ';', '!', '[', ']', '.', '+', '-', '=', '/', '^', '%', '&', '*', '"'],
        // have not workedout the quirks
        // contains: function(value) {
        //     const valueContainedIn = (value, container=[]) => {
        //         let isInvalid = false;
        //         container.forEach( (invalid) => {
        //             if(value.indexOf(invalid) !== -1) {
        //                 isInvalid = true;
        //             }
        //         });
        //         if(isInvalid) {
        //             return true;
        //         } else {
        //             return valueContainedIn(value, )
        //         }
        //     }
        // }
    };
    
    let isValid = true;

    invalid.specialChars.forEach((value) => {
        if(string.indexOf(value) !== -1) {
            isValid = false;
            console.log(isValid);
        }
    });
    invalid.keywords.forEach((value) => {
        if(string.indexOf(value) !== -1) {
            isValid = false;
        }
    });
    return isValid;
};

// TODO: find out if this will actually be useful
const forceTitleCase = (string) => {
    const modifiedString = string[0].toLowerCase() + string.substring(1, string.length - 1).toUpperCase();
    for(let iChar = 0; iChar < string.length; ++iChar) {
        if(string[iChar] === modifiedString[iChar]) return false;
    }
    return true;
};

const errorExists = function(months, name) { 
    for(let month in months) {
        if(month.toLowerCase() === name.toLowerCase())
            return true;
    }
    return false;
};

const detectInvalidError = (error) => typeof error === "object" && error.hasOwnProperty("type") && error.hasOwnProperty("message");

//
const genError = function(name, forceTitleCase=false) {
    if(!isCharString(name)) {
       throw new Error('Names only allow for characters between [a - z] & [A - Z]'); 
    }
    if(forceTitleCase) {
        if(!forceTitleCase(name)) {
            throw new Error('Invalid error naming criteria used for error');
        }
    }
    const firstChartToUpperCase = (functionName) => functionName[0].toUpperCase() + functionName.substring(1, functionName.length); 
    let evalString = "function ret() { return (function " +firstChartToUpperCase(name)+"(message) {";
    //
    evalString += "if('captureStackTrace' in Error) {";
    evalString += " Error.captureStackTrace(this, "+exceptionName+")";
    evalString += "} else this.stack = (new Error()).stack;";
    evalString += "}); }";
    eval(evalString);
   
    const exception = ret();

    exception.prototype      = Object.create(Error.prototype);
    exception.prototype.name = exceptionName;
    exception.prototype.constructor = exception;

    return exception;
};

const typeOf = (value, type) => {
    const valueType = (value).constructor.name.toLowerCase();
    const assertionType = (type).constructor.name.toLowerCase();
    return assertionType === 'string' && valueType === type;
};


//=======================================================

module.exports = {
    ExceptionLogger: ExceptionLogger,
    typeOf: typeOf
};

//=======================================================
