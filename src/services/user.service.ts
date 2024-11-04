import { User } from '../models/models'
import { storageService } from './async-storage.service'
import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    updateLocalUserFields
}

// window.userService = userService


function getUsers() : Promise<User[]>{
    // return storageService.query('user')
    return httpService.get(`user`)
}



async function getById(userId: string): Promise<User> {
    // const user = await storageService.get('user', userId)
    return await httpService.get(`user/${userId}`)
}

function remove(userId: string): Promise<void> {
    // return storageService.remove('user', userId)
    return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }: { _id: string; score: number }): Promise<User> {
    // const user = await storageService.get('user', _id)
    // user.score = score
    // await storageService.put('user', user)

    const user = await httpService.put(`user/${_id}`, {_id, score})
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred: { username: string; password: string }): Promise<User> {
    // const users = await storageService.query('user')
    // const user = users.find(user => user.username === userCred.username)
    const user = await httpService.post('auth/login', userCred)
    if (user) {
        return saveLocalUser(user)
    }
}
async function signup(userCred: { username: string; password: string }): Promise<User> {
    // userCred.score = 10000
    // if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    // const user = await storageService.post('user', userCred)
    const user = await httpService.post('auth/signup', userCred)
    return saveLocalUser(user)
}
async function logout(): Promise<void> {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    return httpService.post('auth/logout')
}


function saveLocalUser(user : User) {
    // user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl, score: user.score }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function updateLocalUserFields(user: Partial<User>): User {
    const currUser = getLoggedinUser();
    const userToSave = { ...currUser, ...user };
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave));
    return userToSave as User;
}

function getLoggedinUser(): User {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || '{}') as User;
}

