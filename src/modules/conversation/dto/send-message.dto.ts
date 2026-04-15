import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class SendMessageRequest {
        @ApiProperty()
        @IsString()
        message: string
    
        @ApiProperty()
        @IsString()
        idReceiver
}