import mongoose from 'mongoose'
import app from './src/app.js'

const port = process.env.PORT || 8080
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/can-i-park-here '

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

app.listen(port, () =>
  console.log(
    `Server running on http://localhost:${port}, connected to db mongodb://${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`
  )
)
