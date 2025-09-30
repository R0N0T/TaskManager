export const setCookie = (name, value, days = 7) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    
    const cookieValue = encodeURIComponent(value) + 
                       '; expires=' + expirationDate.toUTCString() + 
                       '; path=/';
    
    document.cookie = name + '=' + cookieValue;
};

export const removeCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
};