import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FilterOptions } from 'types/filterOption.dto';

export class GetListUser extends FilterOptions {
  @ApiProperty()
  @IsString()
  userName: string;
}
