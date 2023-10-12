const allowedOrigins = ['http://jvm.serveftp.com', 'https://jvm.serveftp.com','https://localhost:3000', 'http://jvm.serveftp.com:3000','https://jvm.serveftp.com:3000',  'https://localhost:4000', 'https://localhost:8081', 'http://localhost:3000', 'http://localhost:4000', 'http://localhost:8081']

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 204,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' // Specify the allowed HTTP methods
}

