function move(id){
    console.log("move id : "+id);
    localStorage.setItem('itemDetail',`${id}`);
    location.href = "/detail";
}
