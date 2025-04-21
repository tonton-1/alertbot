const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

// ตั้งค่าจาก LINE Developer Console

const config = {
  channelAccessToken: "S1NKnWRq0v0RnpKH0sSVeLlr8Pa3o59AfyJUtitQ8Gi89nPhI8gzHCTYTuu6E+xQb04qZV0/X/wtLasfSV8/OLhH5A9rwji2s+qUw6RIMKvEzRxiP0MWNR8PaykuzofsmxKplu27Oq837vIpu6uGpAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "80999893880b70146f568a0c741831d9",
};

const client = new line.Client(config);
app.use("/webhook", line.middleware(config));

// จัดการข้อความที่เข้ามา
app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});
app.get("/", (req, res) => {
  res.send("Hello, welcome to my LINE Bot!");
});
// ฟังก์ชันจัดการ event ต่าง ๆ
function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    // ถ้าไม่ใช่ข้อความ ให้ข้ามไป
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  console.log("ข้อความจากผู้ใช้:", userMessage);
  if (userMessage === "hello") {
    // ถ้าข้อความคือ "hello" ให้ตอบกลับด้วยข้อความ "สวัสดีครับ"
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "สวัสดีครับ",
    });
  } else if (userMessage === "bye") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "บายๆ",
    });
  } else if (userMessage === "test") {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `ทดสอบ1234`,
    });
  } else {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: `กรุณาพิมคำสั่งตามนี้ 1.ถ่ายรูป`,
    });
  }
}

// เริ่มรันเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
