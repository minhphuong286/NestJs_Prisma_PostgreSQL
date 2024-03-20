import { IsOptional, IsString } from 'class-validator';

export class DeviceDto {
  @IsString()
//   @IsNotEmpty()
  deviceName: string = "";

  @IsString()
  @IsOptional()
  deviceLat?: string;
  
  @IsString()
  @IsOptional()
  deviceLong?: string;

  @IsString()
  @IsOptional()
  deviceIp?: string;
}
