const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

const schema = buildSchema(`
    type Query {
        hello: String,
        random: Int,
        rollDice(numDice: Int!, numSides: Int!): [Int]
    }
`);

const root = {
    hello: () => {
        return 'Hello Wolrd!';
    },
    random: () => {
        return Math.floor(Math.random() * 100);
    },
    rollDice: (args) => {
        var output = [];
        for (let i = 0; i < args.numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (args.numSides || 6) ));
        }
        return output;
    }
};

const app = express();
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000);
console.log('Running API at localhost:4000');