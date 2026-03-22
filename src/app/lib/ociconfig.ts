
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common'

/*
 * OCI コンフィグ
 */
export function ociconfig( configdef: string ) : ConfigFileAuthenticationDetailsProvider {
    return new ConfigFileAuthenticationDetailsProvider(process.env.OCI_CONFIG_PATH!,configdef);
}

