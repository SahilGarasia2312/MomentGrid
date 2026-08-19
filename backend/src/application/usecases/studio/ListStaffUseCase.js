'use strict';

class ListStaffUseCase {
  constructor(staffRepository) {
    this.staffRepository = staffRepository;
  }

  async execute({ studioId }) {
    return await this.staffRepository.findByStudioId(studioId);
  }
}

module.exports = ListStaffUseCase;
