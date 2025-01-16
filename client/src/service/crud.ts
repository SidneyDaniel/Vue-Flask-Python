// import { coommitBooks } from '@/utils/commitBooks';

class CreateReadUpdateDelete {
    public userName?: string
    public publisher?: string
    public author?:  string
    public pages?: string
    public cover?: string
    public readLink?: string
    public currentTitle?: string | null
    
    constructor(params: {title?: string, publisher?: string, author?: string, pages?: string,cover?: string,readLink?: string, currentTitle?: string}){
        this.title = params.title
        this.publisher = params.publisher
        this.author = params.author
        this.pages = params.pages
        this.cover = params.cover 
        this.readLink = params.readLink
        this.currentTitle = params.currentTitle
    } 

    public createUser() {
        try {
            fetch('addBook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookName: this.title,
                    bookAuthor: this.author,
                    bookPublisher: this.publisher,
                    numberOfPages: this.pages,
                    readLink: this.readLink,
                    bookCover: this.cover
                })
            }).then(async response => {
                if (response.redirected) {
                    window.location.href = response.url;
                    console.log(response.url);
                    alert("Não Autorizado!")
                } else {
                    // await bookStore.$reset()
                    // await bookStore.fetchBooks()
                    // const a = await bookStore.books
                    // await bookStore.$patch({books: a })
                    coommitBooks()
                    console.log("autorizado");
                    // await bookStore.fetchBooks()
                    return response
                }
            })
            .then(response => response?.json())
            .then(data => {
                console.log(data);
                alert(data.message)
            })
        } catch (error) {
            return error
        } 
    }

    public editUser() {
        try {
            fetch('editBook', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newBookName: this.title,
                    newBookauthor: this.author,
                    newBookPublisher: this.publisher,
                    newBookPages: this.pages,
                    newReadLink: this.readLink,
                    newBookCover: this.cover,
                    currentTitle: this.currentTitle,
                })
            }).then(async response => {
                if (response.redirected) {
                    window.location.href = response.url;
                    console.log(response.url);
                    alert("Não Autorizado!")
                } else {
                    coommitBooks()
                    console.log("autorizado");
                    return response
                }
            })
            .then(response => response?.json())
            .then(data => {
                console.log(data);
                alert(data.message)
            })
        } catch (error) {
            return error
        } 
    }

    public deleteUser() {
        try {
            fetch('removeBook', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.currentTitle,
                })
            }).then(async response => {
                if (response.redirected) {
                    window.location.href = response.url;
                    console.log(response.url);
                    alert("Não Autorizado! ")
                } else {
                    coommitBooks()
                    console.log("autorizado");
                    return response
                }
            })
            .then(response => response?.json())
            .then(data => {
                console.log(data);
                alert(data.message)
                return data
            })
        } catch (error) {
            return error
        } 
    }
}

export default CreateReadUpdateDelete;