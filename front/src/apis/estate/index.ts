import axios from "axios";
import { bearerAuthorization, requestErrorHandler, requestHandler } from "..";
import { GetLocalDataResponseDto } from "./dto/response";
import { GET_LOCAL_DATA_URL } from "src/constant";

// function: 지역 데이터 불러오기 API 함수
export const getLocalDataRequest = async (local: string, accessToken: string) => {
    const result = await axios.get(GET_LOCAL_DATA_URL(local), bearerAuthorization(accessToken))
        .then(requestHandler<GetLocalDataResponseDto>)
        .catch(requestErrorHandler);
    return result;
};