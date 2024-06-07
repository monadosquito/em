import e from 'express'
import bodyParser from 'body-parser'
import p from 'pg'
import joi from 'joi'


const errs = {
    userNotExist: 'User does not exist',
    userExists: 'User already exists',
    emailOccupied: 'E-mail is already occupied',
}


const app = new e()

const router = e.Router()

const userSchema = joi.object({
    id: joi.number(),
    email: joi.string().email(),
    password: joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
    lastName: joi.string().min(3).max(15).required().pattern(/^[a-zA-Z]*$/),
    firstName: joi.string().min(3).max(15).required().pattern(/^[a-zA-Z]*$/),
    middleName: joi.string().min(3).max(15).pattern(/^[a-zA-Z]*$/),
})

const pool = new p.Pool({
    user: 'em',
    password: '123',
})

const toUser = ({ last_name, first_name, middle_name, ...user }) =>
    ({
        ...user,
        lastName: last_name,
        firstName: first_name,
        middleName: middle_name,
    })

router.post('/', async (req, res, next) => {
    const { error, value: user } = userSchema.validate(req.body)
    const userInvalid = error
    if (userInvalid) {
        next(error.details[0].message)
        return
    }
    const { email, password, lastName, firstName, middleName } = user
    const addUserQry = await pool.query(
        'INSERT INTO user_(\
            email, \
            password, \
            last_name, \
            first_name, \
            middle_name \
        ) \
        VALUES ($1, $2, $3, $4, $5) \
        ON CONFLICT DO NOTHING \
        RETURNING *',
        [ email, password, lastName, firstName, middleName ],
    )
    const addedDbUser = addUserQry.rows[0]
    if (!addedDbUser) {
        const err = { status: 400, message: errs.userExists }
        next(err)
        return
    }
    const addedUser = toUser(addedDbUser)
    await fetch(`http://localhost:8001/user-history`, {
        method: 'POST',
        body: JSON.stringify(addedUser),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    res.sendStatus(200)
})
router.put('/:id', async (req, res, next) => {
    const { error, value: user } = userSchema.validate(req.body)
    const userInvalid = error
    if (userInvalid) {
        const err = { status: 400, message: error.details[0].message }
        next(err)
        return
    }
    const id = req.params.id
    const userExistQry = await pool.query(
        'SELECT EXISTS (SELECT * FROM user_ WHERE id = $1)',
        [ id ],
    )
    const userExist = userExistQry.rows[0].exists
    if (!userExist) {
        const err = { status: 400, message: errs.userNotExist }
        next(err)
        return
    }
    const { email, password, lastName, firstName, middleName } = user
    const emailOccupiedQry = await pool.query(
        'SELECT EXISTS (SELECT * FROM user_ WHERE email = $1)',
        [ email ],
    )
    const emailOccupied = emailOccupiedQry.rows[0].exists
    if (emailOccupied) {
        const err = { status: 400, message: errs.emailOccupied }
        next(err)
        return
    }
    await pool.query(
        'UPDATE user_ SET \
            email = $2, \
            password = $3, \
            last_name = $4, \
            first_name = $5, \
            middle_name = $6 \
        WHERE id = $1',
        [ id, email, password, lastName, firstName, middleName ],
    )
    await fetch(`http://localhost:8001/user-history/${id}`, {
        method: 'PATCH',
    })
    res.sendStatus(200)
})
router.get('/', async (_, res) => {
    const allUsersQry = await pool.query('SELECT * FROM user_')
    const allUsers = allUsersQry.rows
    res.status(200).json(allUsers)
})
router.use((err, _, res, __) => {
    console.error(err)
    res.status(err.status).send(err.message)
})

app.use(bodyParser.json())
app.use('/user', router)
app.listen(8000)
