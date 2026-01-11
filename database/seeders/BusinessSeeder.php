<?php

namespace Database\Seeders;

use App\Models\Business;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BusinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $business = Business::firstOrCreate(
            ['id' => 1],
            ['name' => 'RSW Default Business']
        );

        // Ensure API key exists (do NOT overwrite if already set)
        if (empty($business->api_key)) {
            $business->update([
                'api_key' => Str::random(40),
            ]);
        }
    }
}
