<<<<<<< HEAD
onload = () => {
    const c = setTimeout(() =>{
        document.body.classList.remove("not-loaded");
        clearTimeout(c);
    }, 5000);
=======
onload = () => {
    const c = setTimeout(() =>{
        document.body.classList.remove("not-loaded");
        clearTimeout(c);
    }, 2000);
>>>>>>> cd6f3fd1a0b0ac1dc821648ae019a98922db8d30
};