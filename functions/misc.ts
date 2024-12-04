export const getPassword = (text1:string, text2:string):string=>{
    const first = text1?.split(' ')[0];
    const second = text2.trim().slice(-5);
    const password = first + second;
    return password;
}