import { PROJECT_TOKEN, USD_TOKEN, UTILITY_TOKEN } from "../constants/tokens";
import { Token } from "../sdk-core";

export function useToken(tokenAddress?: string | null): Token | null | undefined {
    switch (tokenAddress) {
        case USD_TOKEN.address:
            return USD_TOKEN;

        case PROJECT_TOKEN.address:
            return PROJECT_TOKEN;

        case UTILITY_TOKEN.address:
            return UTILITY_TOKEN;
    }
}