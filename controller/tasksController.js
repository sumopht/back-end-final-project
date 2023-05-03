const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    PutCommand,
    DeleteCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand,
    PutItemCommand
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// exports.getGroupMembers = async (req, res) => {
//     const params = {
//         TableName: process.env.aws_tasks_table_name,
//     };
//     try {
//         const data = await docClient.send(new GetCommand(params));
//         res.send(data);
//         console.log("Retrieved item: ", data);
//     } catch (err) {
//         console.error("Error retrieving item: ", err);
//         res.status(500).send(err);
//     }
// };

// TODO #1.1: Get items from DynamoDB
exports.getTasks = async (req, res) => {
    const student_id = req.params.student_id;

    const params = {
        TableName: process.env.aws_tasks_table_name,
        Key: {
            student_id: student_id,
        },
    };
    try {
        const data = await docClient.send(new GetCommand(params));
        res.send(data);
        console.log("Retrieved item: ", data);
    } catch (err) {
        console.error("Error retrieving item: ", err);
        res.status(500).send(err);
    }
};

// TODO #1.2: Add an item to DynamoDB
exports.addTask = async (req, res) => {
    const student_id = req.params.student_id;
    const task_title = req.params.task_title;

    const params = {
        TableName: process.env.aws_tasks_table_name,
        Item: {
            student_id: student_id,
            task_title: task_title,
        },
    };

    try {
        const data = await docClient.send(new PutItemCommand(params));
        res.send("addTask complete");
        console.log("Success - task added", data);
    } catch (err) {
        console.log("Error -", err);
        res.status(500).send(err);
    }
};


// TODO #1.3: Delete an item from DynamDB
exports.deleteTask = async (req, res) => {
    const student_id = req.params.student_id;
    const task_title = req.params.task_title;

    const params = {
        TableName: process.env.aws_tasks_table_name,
        Key: {
            student_id: student_id,
            task_title: task_title
        }
    };

    try {
        const data = await docClient.delete(params).promise();
        res.send("deleteTask complete");
        console.log("Success - task deleted", data);
    } catch (err) {
        console.log("Error -", err);
        res.status(500).send(err);
    }
};