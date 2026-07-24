import Hotel from '../db/models/hotel.ts';
import type { CreateHotelDto } from '../dtos/hotel.dto.ts';

export class HotelRepository {
    hotelRepository;
    constructor() {
        this.hotelRepository = Hotel;
    }
    async create(createHotelDto: CreateHotelDto) {
        const data = await this.hotelRepository.create({ ...createHotelDto });
        return data;
    }
    async findById(id: number) {
        const hotel = await this.hotelRepository.findByPk(id);
        if (!hotel) {
            throw new Error('Hotel not found');
        }
        return hotel;
    }
    updateById() {}
}
