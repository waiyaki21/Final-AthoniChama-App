<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 1),
            'payment' => $this->faker->numberBetween(4000, 6000),
            'cycle_id' => $this->faker->numberBetween(1, 2),
            'member_id' => $this->faker->numberBetween(1, 1),
            'created_at' => $this->faker->dateTimeInInterval('-11 months', '+2 weeks')
        ];
    }
}
