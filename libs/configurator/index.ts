import Redis from "ioredis"

import { db, PostgresJsDatabase } from "database"
import { envReader } from "env-reader"
import pretty from "pino-pretty"

import pino from "pino"

import { JwtManager } from "./jwt-manager"
import { LoggerService } from "./types"
//import { complement, compose, either, isNil, isNotNil, path, prop, when } from "ramda"
//import { has } from "rambda"
// import { lookup}from '@effect/data/ReadonlyRecord'
// // import { LoggerService } from "."

// import O,{some,none,Option} from "@effect/data/Option"
// import * as M from "fp-ts/lib/Map"
// import { fold } from "fp-ts/lib/Option"




const debug = <T>(key:string)=>(value:T):T=>{
  console.log(`DEBUG:${key} : ${value}`)
  return value
}

type State = {
  logger: O.Option<LoggerService>
  jwt: O.Option<JwtManager>,
  postgre: O.Option<PostgresJsDatabase>,
  redis: O.Option<Redis>,
  env: O.Option<Record<string, string>>,
}
type ConfiguratorFunc = (config?: RouteGroupConfig) => O.Option<State>
const getLogger = lookup('logger')
const getEnv = lookup('env')
const getRedis = lookup('redis')
const getFromEnv = lookup('fromEnv')
const getPostgre = lookup('postgre')
const getJwt = lookup('jwt')

const getUrl= (redis : Option<RedisConfig>)=>lookup('url')

const path = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keyPath: K[]
): O.Option<T[K]> => keyPath.reduce(
    (acc, key) => O.chain((o) => O.fromNullable(o[key]))(acc),
    O.of(obj)
  );
//const getPostgreFromEnv = compose(getFromEnv, getPostgre)
//const getRedisFromEnv = compose(getFromEnv, getRedis)
// const isNotNull = complement(isNil)
//import { when } from 'fp-ts-std/Function'
// const createPinoLogger = () => pino(pretty())
// const getConfigLogger =(config: RouteGroupConfig)=>  getLogger(config).map((v)=>console.log(v))
// const isConfigLogger =(config: RouteGroupConfig)=> has('logger',config)
// const isConfigEnv =(config: RouteGroupConfig)=> has('env',config)
// const isConfigJwt =(config: RouteGroupConfig)=>has('jwt',config)
// const isConfigPostgre =(config: RouteGroupConfig)=> has('postgre',config)
// const isConfigRedis=(config: RouteGroupConfig)=>has('redis',config)

// const createLoggerIfInConfig = (config?: RouteGroupConfig) => when(isConfigLogger, createPinoLogger);
// const createEnvReader = (fields: string[]) => envReader(fields)
// const createEnvIfInConfig = (config?: RouteGroupConfig) => when(isConfigEnv, createEnvReader);
// const getConfigRedisUrl = (config?: RouteGroupConfig) => path(['redis', 'url'])(config)
// const createRedis = (url: string) => new Redis(url)
// const createRedisIfInConfig = (config?: RouteGroupConfig) => when(isConfigEnv, createRedis);
// const getRedisUrl = (env?: Record<string, string>, config?: RouteGroupConfig) => getConfigRedisUrl(config) || lookup("REDIS_URL")(env)
// const createPostgreIfInConfig = (config?: RouteGroupConfig) => when(isConfigEnv, createEnvIfInConfigReader);

// const createJwtService = (secret: string) => new JwtManager(secret)
// const createJwtIfInConfig = (config?: RouteGroupConfig) => when(isConfigEnv, createJwtService);
type CreateEnvReader = (env:Option<EnvConfig>)=> Option<Record<string,string>>
const createEnvReader :CreateEnvReader = O.map(({fields})=>envReader(fields))

const filterRecordNullable = Record.filterMap((val:any)=>Boolean(val)?O.some(val):O.none)
type CreateStateFromConfig = (config: RouteGroupConfig)=>O.Option<State> ;

const getRedisUrl = flow(getRedis,getUrl)
// const getRedis = Record.lookup('redis')



const createStateFromConfig:CreateStateFromConfig = (config) =>{


  let envPipe = flow(
    O.fromNullable(config.env),

  )(config)

  let a =pipe(
    O.Do, 
    O.bind("env", _=>createEnvReader( O.fromNullable(config.env)))
    
    
    )
  // let a =flow(  M.fromFoldable,



   

  // // )(config)
  // Record.collect(Record.filterMap)
   return O.none
}
export const configuration: ConfiguratorFunc =  flow(
  O.fromNullable,
  
  O.chain(createStateFromConfig)
 )
 
//  return O.none
//  O.fromNullable(config).map(createStateFromConfig)
  // return  flow( O.fromNullable, createStateFromConfig, )(config)


  // let a = O.fromNullable(config)
  // O.map((config)=>createStateFromConfig(config))(a)
  // let env = createEnvIfInConfig(config)
  // let redis = createRedisIfInConfig(config)
  // let postgre = createPostgreIfInConfig(config)
  // let jwtService = createJwtIfInConfig(config)

  // let logger = createLoggerIfInConfig(config)

  // if (config) {
  //   if (config.redis) {
  //     if (config.redis.fromEnv) {
  //       const REDIS_URL = getRedisUrl(env([]), config)
  //       console.log("REDIS_URL = ", REDIS_URL)
  //       if (!REDIS_URL) {
  //         throw "REDIS URL MUST BE DEFINED IN ENV FILE"
  //       }
  //       redis = new Redis(REDIS_URL)
  //     }
  //     //@ts-ignore
  //     logger?.info("Redis installed and connected")
  //   }
  //   if (config.postgre) {
  //     if (config.postgre.fromEnv) {
  //       postgre = db(undefined, env)
  //     } else {
  //       postgre = db(config.postgre.credentials)
  //     }
  //     //@ts-ignore
  //     logger?.info("Postgre installed and connected")
  //   }
  //   if (config.jwt) {
  //     const secret = config.jwt.fromEnv ? env?.["JWT_SECRET"] : config.jwt.secret
  //     if (!secret) {
  //       throw "JWT_SECRET MUST BE DEFINED!"
  //     }
  //     jwtService = new JwtManager(secret)
  //   }
  //   //@ts-ignore
  //   logger?.info("Jwt installed and configured")
  // }
  // return {
  //   logger,
  //   jwt: jwtService,
  //   postgre,
  //   redis,
  //   env,
  // }
}

// export function configuration<Ctx>(config?: RouteGroupConfig) {
//   let env: Record<string, string> | undefined
//   let redis: Redis | undefined
//   let postgre: PostgresJsDatabase | undefined
//   let jwtService: JwtManager | undefined
//   let logger: LoggerService | undefined

//   if (config) {
//     if (config.logger) {
//       const pretty_logger = pino(pretty())

//       logger = pretty_logger
//       logger.info("Logger installed")
//     }
//     if (config.env) {
//       const envMap = envReader(config.env.fields)
//       env = envMap
//       //@ts-ignore
//       logger?.info("Env reader installed")
//     }
//     if (config.redis) {
//       if (config.redis.fromEnv) {
//         const REDIS_URL = config.redis.url || env?.["REDIS_URL"]
//         console.log("REDIS_URL = ", REDIS_URL)
//         if (!REDIS_URL) {
//           throw "REDIS URL MUST BE DEFINED IN ENV FILE"
//         }
//         redis = new Redis(REDIS_URL)
//       }
//       //@ts-ignore
//       logger?.info("Redis installed and connected")
//     }
//     if (config.postgre) {
//       if (config.postgre.fromEnv) {
//         postgre = db(undefined, env)
//       } else {
//         postgre = db(config.postgre.credentials)
//       }
//       //@ts-ignore
//       logger?.info("Postgre installed and connected")
//     }
//     if (config.jwt) {
//       const secret = config.jwt.fromEnv ? env?.["JWT_SECRET"] : config.jwt.secret
//       if (!secret) {
//         throw "JWT_SECRET MUST BE DEFINED!"
//       }
//       jwtService = new JwtManager(secret)
//     }
//     //@ts-ignore
//     logger?.info("Jwt installed and configured")
//   }
//   return {
//     logger,
//     jwt: jwtService,
//     postgre,
//     redis,
//     env,
//   }
// }
