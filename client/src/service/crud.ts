// import { coommitBooks } from '@/utils/commitBooks';

class CreateReadUpdateDelete {
    public listOfUsers?: string[]
    public username?: string
    public password?: string
    public roles?: string[]
    public preferences?:  {timezone: string}
    public active?: boolean
    public currentUserName?: string
    
    constructor(params: {
        listOfUsers?: string[] ,
        username?: string, 
        password?: string,
        roles?: string[],
        preferences?: {timezone: string},
        active?: boolean,
        currentUserName?: string
    }){
        this.listOfUsers = params.listOfUsers
        this.username = params.username
        this.password = params.password
        this.roles = params.roles
        this.preferences = params.preferences
        this.active = params.active
        this.currentUserName = params.currentUserName
    } 

    public async createUser() {
        
        const today = new Date().getTime() / 1000
        
        const generatePassword = (length: number) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
            let password = ''; 
            for (let i = 0; i < length; i++) { 
                const randomIndex = Math.floor(Math.random() * characters.length)
                password += characters[randomIndex]
            } 
            return password
        }
        

        try {
            const response = await fetch('http://localhost:5001/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    password: generatePassword(10),
                    roles: this.roles,
                    preferences: this.preferences,
                    created_ts: today,
                    active: false,
                })
                }
            )

            if (!response.ok) {throw new Error('Error to create user')}

            return response

        } catch (error) {
            return (error as Error).message

        }
    }
       

    public async updateUser() {        
        try {
            const response = await fetch('http://localhost:5001/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username ,
                    password: this.password,
                    roles: this.roles,
                    preferences: this.preferences,
                    active: this.active ,
                    currentUserName: this.currentUserName, 
                })
                }
            )

            if (!response.ok) {throw new Error('Error to create user')}

            return response
        } catch (error) {
            return (error as Error).message
        }finally{

        }
    }

    public async deleteUser() {
        try {
            const response = await fetch('http://localhost:5001/deleteUsers', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    listOfUsers: this.listOfUsers
                })
                }
            )

            if (!response.ok) {throw new Error('Error to delete user')}

            return response
        } catch (error) {
            return (error as Error).message
        } finally {

        }
    }

    public async getUsers() {
        try {
            const response: Response = await fetch('http://localhost:5001/getUsers')

            if (!response.ok) {throw new Error('Erro ao buscar dados')}

            return response
        } catch (error) {
             return (error as Error).message
        } 
    }
}

export default CreateReadUpdateDelete;