import Hotel from '../db/models/hotel.ts';
import type { CreateHotelDto } from '../dtos/hotel.dto.ts';
import { HotelRepository } from '../repositories/hotel.repository.ts';

export default class HotelService {
    hotelRepository;
    constructor() {
        this.hotelRepository = new HotelRepository();
    }
    async create(createHotelDto: CreateHotelDto) {
        return this.hotelRepository.create({ ...createHotelDto });
    }
    async findById(id: number): Promise<Hotel> {
        return this.hotelRepository.findById(id);
    }
}
