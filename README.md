# sql-app

## para la tarea
UserService(private RedisCacheService redisCacheService, private UserRepository userRepository)
getUserById(ID)
    const userCache = Redis.get(USER:ID)
    const userObject = JSON.parse(userCache)
    if(userObject){
        return userObject
    }
    const userDB = userRepository.getUserById(ID)
    if (userDB){
        Redis.set(USER:ID, JSON.stringify(userDB))
    }
    
    Redis.set(USER:ID, JSON.stringify(userDB))