using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Common
{
    public class Result<T>
    {
        public string Msg { get; set; }
        public int Code { get; set; }
        public string Type { get; set; }
        public T Data { get; set; }
        public bool Ok => Type == ResultType.Ok;


        protected Result()
        {
        }

        public static Result OK()
            => new Result { Msg = null, Code = 0, Type = ResultType.Ok, Data = null };

        public static Result<NT> OK<NT>(NT data = default(NT), string msg = null, int code = 0)
            => new Result<NT> { Msg = msg, Code = code, Type = ResultType.Ok, Data = data };

        public static Result<NT> Error<NT>(string msg = null, int code = 3)
            => new Result<NT> { Msg = msg, Code = code, Type = ResultType.Error, Data = default(NT) };

        public static Result<NT> SF<NT>(string msg = "Sesión terminada", int code = 4)
            => new Result<NT> { Msg = msg, Code = code, Type = ResultType.SF, Data = default(NT) };

        public static Result<NT> ServerError<NT>(string msg = "Fallo al realizar operación", int code = 5)
            => new Result<NT> { Msg = msg, Code = code, Type = ResultType.Error, Data = default(NT) };


        public static Result<ResultError> Error(string msg = null, int code = 3)
            => new Result<ResultError> { Msg = msg, Code = code, Type = ResultType.Error, Data = null };

        public static Result<ResultError> SF(string msg = "Sesión terminada", int code = 4)
            => new Result<ResultError> { Msg = msg, Code = code, Type = ResultType.SF, Data = null };

        public static Result<ResultError> ServerError(string msg = "Fallo al realizar operación", int code = 5)
            => new Result<ResultError> { Msg = msg, Code = code, Type = ResultType.Error, Data = null };

        public static implicit operator Result<T>(Result<ResultError> v)
            => new Result<T> { Msg = v.Msg, Code = v.Code, Type = v.Type, Data = default(T) };

    }

    public class Result : Result<Empty>
    {
        public static implicit operator Result(Result<ResultError> v)
            => new Result { Msg = v.Msg, Code = v.Code, Type = v.Type, Data = null };
    }

    public class ResultType
    {
        public static readonly string Ok = "ok";
        public static readonly string Error = "error";
        public static readonly string SF = "sf";
    }



    public class Empty
    {

        private Empty()
        {
        }
    }
    public class ResultError
    {

        private ResultError()
        {
        }
    }
}
