//1. Project Setup
// Html->canvas, css
// javascript reference
// canvas setting and obtaining context
//2. Player setup, 
//3. Velocity y
//4. gravity
//5. Movement 
//6. Platform
//7. Platform Collision, Multiple Platforms(array)
//8. Scrolling Effect
//9. Offset ->Win situation
const gravity = 0.5;
const speed = 5;
const baseHeight = 160;
let offset = 0;
const maxRight = 1200;
const maxLeft = 180;



const gameCanvas = document.querySelector("#gameCanvas");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
gameCanvas.style.background = "yellow";
const keys = {
    right: false,
    left: false
}
const context = gameCanvas.getContext("2d");
// class Player {
//     constructor() {
//         this.position = {
//             x: 150,
//             y: 300
//         }
//         this.velocity = {
//             x: 0,
//             y: 1
//         }
//         this.width = 20;
//         this.height = 20;
//     }
//     draw() {
//         context.fillStyle = "black";
//         context.fillRect(this.position.x, this.position.y, this.width, this.height);
//     }
//     update() {

//         this.position.y += this.velocity.y;
//         this.position.x += this.velocity.x;

//         if (this.position.y + this.height + this.velocity.y >= window.innerHeight) {
//             this.velocity.y = 0;
//             window.location.reload();


//         }
//         else
//             this.velocity.y += gravity;


//         this.draw();
//     }
// }

class Player {
    constructor() {
        this.position = {
            x: 150,
            y: 300
        }
        this.velocity = {
            x: 0,
            y: 1
        }
       
        this.image=playerStandRight;
         this.width = 66;
        this.height = 150;
        this.frames=0;
        this.cropwidth=177;
    }
    draw() {
        this.frames++;
        if(this.frames>59 && this.image==playerStandRight)
            this.frames=0;

         if(this.frames>29 && this.image==playerRunRight)
            this.frames=0;


        //context.fillStyle = "black";
        //context.fillRect(this.position.x, this.position.y, this.width, this.height);
        context.drawImage(
            this.image,
            this.cropwidth*this.frames,
            0,
            this.cropwidth,
            400,
            this.position.x,
            this.position.y,
            this.width,this.height);
    }
    update() {

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y >= window.innerHeight) {
            this.velocity.y = 0;
            window.location.reload();


        }
        else
            this.velocity.y += gravity;


        this.draw();
    }
}

// class Platform {
//     constructor(x, y, width, height,image) {
//         this.position = {
//             x: x,
//             y: y
//         }
//         this.image=image;
//         this.width = image.width;
//         this.height = image.height;
//     }
//     draw() {
//         context.drawImage(this.image,this.position.x,this.position.y)
//         // context.fillStyle = "red";
//         // context.fillRect(this.position.x, this.position.y, this.width, this.height);
//     }
// }

class Platform {
    constructor(x, y, image) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }
    draw() {
        context.drawImage(this.image, this.position.x, this.position.y)
        // context.fillStyle = "red";
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// //Platform 1
// const platform = new Platform(350, window.innerHeight - 100 - baseHeight, 50, 100,platformSmall);
// const platform1 = new Platform(750, window.innerHeight - 100 - baseHeight, 50, 100,platformSmall);
// const platform2 = new Platform(1350, window.innerHeight - 100 - baseHeight, 50, 100,platformSmall);
// //base
// const basePlatform = new Platform(0, window.innerHeight - baseHeight, 550, baseHeight,platformBase);
// const basePlatform1 = new Platform(620, window.innerHeight - baseHeight, 1250, baseHeight,platformBase);
// platforms.push(platform, platform1, platform2, basePlatform, basePlatform1);

//const platform=new Platform(350,window.innerHeight-100,100,20);
//platform.draw();
let gameStart = false;
let count = 0;
let backImage = new Image()
backImage.src = "./images/background.png";

let hillsImage = new Image()

let platformBase = new Image()

let platformSmall = new Image()

let playerStandRight = new Image()
let playerRunRight = new Image()

let images = [backImage, hillsImage, platformBase, platformSmall,playerStandRight,playerRunRight];

images.forEach((image) => {
    image.addEventListener("load", () => {
        count++;
    console.log(count);
        if (count == images.length)
            createObject();

    })
})

hillsImage.src = "./images/hills.png";
platformBase.src = "./images/platform.png";
platformSmall.src = "./images/platformSmallTall.png";
playerStandRight.src = "./images/spriteStandRight.png";
playerRunRight.src = "./images/spriteRunRight.png";

let player;
const platforms = [];
function createObject() {

    player = new Player();
    player.draw();
    const platform1 = new Platform(280, window.innerHeight - platformBase.height - platformSmall.height + 100, platformSmall);


    const basePlatform = new Platform(0, window.innerHeight - platformBase.height, platformBase);
    const basePlatform1 = new Platform(650, window.innerHeight - platformBase.height, platformBase);
    const basePlatform2 = new Platform(645 + platformBase.width, window.innerHeight - platformBase.height, platformBase);

    //platforms.push(platform, platform1, basePlatform, basePlatform1);
    platforms.push(platform1, basePlatform, basePlatform1, basePlatform2);

    animate();

}

// let id=setInterval(startGame,500);
// function startGame()
// {
// if(count==4 && gameStart==false)
// {
// gameStart=true;   
// console.log("Game started..")
// clearInterval(id); 
// animate();
// }


// }

//Platform 1
//const platform = new Platform(350, window.innerHeight - 100 - baseHeight,platformSmall);
//const platform1 = new Platform(750, window.innerHeight - 100 - baseHeight,platformSmall);
//const platform2 = new Platform(1350, window.innerHeight - 100 - baseHeight,platformSmall);
//base


function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    context.drawImage(backImage, 0 - offset, 0);
    context.drawImage(hillsImage, 0 - offset, 0);

    // platform.draw();
    // platform1.draw();
    platforms.forEach((platform) => {
        platform.draw();
    })

    player.update();

    if (offset >= 5000)
        console.log("game win");


    platforms.forEach((platform) => {
        //Collision
        if (player.position.x + player.width + 1 >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width &&
            player.position.y + player.height >= platform.position.y &&
            player.position.y <= platform.position.y + platform.height
        )
            player.velocity.x = 0;

        if ((player.position.y + player.height) <= platform.position.y &&
            (player.position.y + player.height + player.velocity.y) >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            &&
            player.position.x <= platform.position.x + platform.width

        )
            player.velocity.y = 0;

    })


    if(keys.right)
    {
        player.image=playerRunRight;
        player.width=127;
        player.cropwidth=340;


    }
else{
    player.image=playerStandRight;
    player.width=66;
    player.cropwidth=177;
}
    if (keys.right && player.position.x <= maxRight) {
        //offset += speed;
        player.velocity.x = speed;
    }
    else if (keys.left && player.position.x >= maxLeft) {
        player.velocity.x = -speed;
        //offset -= speed;
    }
    else {
        player.velocity.x = 0;

        if (keys.right) {
            offset += speed;
            platforms.forEach((platform) => {
                platform.position.x -= speed;

            })
        }

        if (keys.left) {
            offset -= speed;
            platforms.forEach((platform) => {
                platform.position.x += speed;

            })
        }

    }
    console.log(offset);



}


addEventListener("keydown", (e) => {
    //console.log(e);
    if (e.key == "ArrowRight")
        keys.right = true;
    // player.velocity.x=speed;
    if (e.key == "ArrowLeft")
        keys.left = true;
    //player.velocity.x=-speed;
    if (e.key == "ArrowUp")
        player.velocity.y = -11;
})

addEventListener("keyup", (e) => {
    //console.log(e);
    if (e.key == "ArrowRight")
        keys.right = false;
    // player.velocity.x=0;
    if (e.key == "ArrowLeft")
        keys.left = false;
    //player.velocity.x=0;
})