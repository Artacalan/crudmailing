import express, {Request, Response} from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'colleen.schoen58@ethereal.email',
        pass: 'Jrn1Zz5sYh3dZAmwPW'
    }
});

export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();
const PORT : string = process.env.PORT || "25565";

export type Product = {
    id: number,
    title: string,
    description?: string,
}

export let bdd : Product[] = []
let id_in_bdd : number = 1

app.get("/", (request: Request, response: Response) => {
    response.status(200).send("Hello World");
});

app.post("/product/add", (request: Request, response: Response) => {
    const product: Product = {
        id: id_in_bdd++,
        title: request.body.title,
        description: request.body.description,
    };
    bdd.push(product);

    // Respond with the newly created product instead of the entire array
    response.status(200).send(product);

    const mailOptions = {
        from: "colleen.schoen58@ethereal.email",
        to: "colleen.schoen58@ethereal.email",
        subject: `Product created : ${request.body.title}`,
        text: `Product created : ${request.body.title}. ${request.body.description}`,
        html: `<h1>Product created : ${request.body.title}.</h1> <p>${request.body.description}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
});


app.get("/product/:id", (request: Request, response: Response) => {
    const product = bdd.find(product => product.id === parseInt(request.params.id));
    if (product) {
        response.status(200).send(product);
    } else {
        response.status(404).send({ error: "Product not found" });
    }
});


app.get("/allProducts", (request: Request, response: Response) => {
    response.status(200).send(bdd);
});

app.post("/product/update", (request: Request, response: Response) => {
    const updatedProduct = bdd.find(product => product.id === parseInt(request.body.id));

    if (updatedProduct) {
        updatedProduct.title = request.body.title;
        updatedProduct.description = request.body.description;

        response.status(200).send(updatedProduct); // Return updated product

        const mailOptions = {
            from: "colleen.schoen58@ethereal.email",
            to: "colleen.schoen58@ethereal.email",
            subject: `Product updated : ${request.body.title}`,
            text: `Product updated : ${request.body.title}. ${request.body.description}`,
            html: `<h1>Product updated : ${request.body.title}.</h1> <p>${request.body.description}</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } else {
        response.status(404).send({ error: "Product not found" });
    }
});


app.post("/product/delete", (request: Request, response: Response) => {
    bdd = bdd.filter(product => product.id !== parseInt(request.body.id));

    const mailOptions = {
        from: "colleen.schoen58@ethereal.email",
        to: "colleen.schoen58@ethereal.email",
        subject: `Product deleted : ${request.body.id}`,
        text: `Product deleted : ${request.body.id}`,
        html: `<h1>Product updated : ${request.body.id}.</h1>`,
    };

    response.status(200).send(bdd);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    })
});

app.listen(PORT, () : void => {
    console.log(`Listening on port ${PORT}`);
});