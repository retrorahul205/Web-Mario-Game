const gameCanvas=document.querySelector("#gameCanvas");


gameCanvas.width=window.innerWidth;
gameCanvas.height=window.innerHeight;
gameCanvas.style.background="yellow";

const context=gameCanvas.getContext("2d");

context.fillStyle="red";
//context.fillRect(100,100,50,100);
//context.strokeRect(100,200,50,100);

// context.arc(100,100,50,0,Math.PI,true);
// context.stroke();
// context.beginPath();
// context.moveTo(200,200);
// context.lineTo(100,100);
// context.stroke();
// context.closePath();

// context.font="50px Arial";
// //context.fillText("Hello",200,200);

// context.strokeText("Hello",200,200);



class Circle{
   // x=10;
   constructor(x,y,radius,speed){

    this.x=x;
        this.y=y;
        this.radius=radius;
        this.speed=speed;
   }
    display()
    {
        this.x=10;

        console.log(this.x);
    }
    read(x,y,radius)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        

    }
    draw()
    {
        context.beginPath();
        context.arc(this.x+this.speed,this.y+this.speed,this.radius,0,Math.PI*2);
        context.stroke();
        context.closePath();



    }

}

//Cricle c;
//Circle *c=new Circle();


// //Circle c=new Circle()
// let c=new Circle(100,100,50);
// //c.display();
// //c.read(100,100,50);
// c.draw();

// let c1=new Circle(200,100,50);
// //c1.read(100,200,50);
// //c.display();
// c1.draw();
let circles=[];
for(i=1;i<=10;i++)
{
    let x=Math.random()*window.innerWidth;
    let y=Math.random()*window.innerHeight;
    let c=new Circle(x,y,50,1);
    circles.push(c);

    c.draw();

}

// circles.forEach((circle)=>{
//     circle.draw();

// })





// let c=new Circle(100,100,50,5);
// c.draw();

// console.log("First");
// setTimeout(test,0);
// console.log("Second");

// function test()
// {
//     console.log("Test called");
// }

//setInterval(animate,100)
// function animate()
// {
//     requestAnimationFrame(animate);

//     context.clearRect(0,0,window.innerWidth,window.innerHeight);

//     c.speed+=1;
//     c.draw();

// }

// animate();

function animate()
{

    requestAnimationFrame(animate);
    context.clearRect(0,0,window.innerWidth,window.innerHeight);
    circles.forEach((circle)=>{
        circle.speed+=1;
        circle.draw();
        
    })


}

animate();
