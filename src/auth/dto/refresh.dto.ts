import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsString()
  @IsOptional()
  deviceName?: string = "";
}
