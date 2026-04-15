import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateNewMessageRequest {
    @ApiProperty()
    @IsString()
    message: string

    @ApiProperty()
    @IsString()
    idReceiver
}