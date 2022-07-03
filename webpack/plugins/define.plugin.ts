import dotenv from 'dotenv'
import { DefinePlugin } from 'webpack'
import { IS_DEV } from '../env'

interface Props {
	server?: boolean
	spa?: boolean
	env: any;
}

dotenv.config()
const config = (isServer: boolean, spa: boolean, env: string) => ({
	IS_SERVER: isServer,
	IS_DEV,
	IS_SPA: spa,
	'process.env': env,
})

export const definePlugin = ({ server = false, spa = false, env, }: Props) => new DefinePlugin(config(server, spa, env))
