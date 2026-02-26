export const event = {
  body: JSON.stringify({
    teamId: "team001",
    teamName: "サンプルチーム",
    establishDt: "2024-04-01",
    pass: "test1234",
    repass: "test1234",
    leaderName: "山田太郎",
    email: "test@example.com"
  }),
  headers: {
    "Content-Type": "application/json"
  },
  httpMethod: "POST",
  isBase64Encoded: false
} as any;