export default class BaseHttpService{
    
    protected baseUrl:string = "http://localhost:45334";

    protected async get<TResult>(url:string):Promise<TResult>{
        return new Promise<TResult>((resolve, reject) => {
            fetch(`${this.baseUrl}/${url}`, {
                method: "get"
            }).then(response => {
                
                response.json()
                    .then(result => resolve(result as TResult))
                    .catch(reject);
            }).catch(reject);
        });
    }
    
    public getBaseUrl():string{
        return this.baseUrl;
    }

    protected async getRaw(url:string):Promise<string>{
        return new Promise<string>((resolve, reject) => {
            fetch(`${this.baseUrl}/${url}`, {
                method: "get"
            }).then(response => {
                
                response.text()
                    .then(result => resolve(result))
                    .catch(reject);
            }).catch(reject);
        });
    }

    protected post<T, TResult>(url:string, parameter:string|T, forceJson:boolean = false):Promise<TResult>{
        return new Promise<TResult>((resolve, reject) => {
            fetch(`${this.baseUrl}/${url}`, {
                method: "post",
                body: !forceJson && typeof parameter === "string" ? parameter :  JSON.stringify(parameter)
            }).then(response => {
                response.json()
                    .then(result => resolve(result as TResult))
                    .catch(reject);
            }).catch(reject);
        });
    }
    
    protected postFile<TResult>(url:string, file:File):Promise<TResult>{        
        return new Promise<TResult>((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", file);
            fetch(`${this.baseUrl}/${url}`, {
                method: "post",
                body:formData
            }).then(response => {
                response.json()
                .then(result => resolve(result as TResult))
                .catch(reject);
            }).catch(reject);
    });
    }

    protected delete<TResult>(url:string):Promise<TResult>{
        return new Promise<TResult>((resolve, reject) => {
            fetch(`${this.baseUrl}/${url}`, {
                method: "delete"
            }).then(response => {
                response.json()
                    .then(result => resolve(result as TResult))
                    .catch(reject);
            }).catch(reject);
        });
    }
}