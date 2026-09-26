<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PharmacyItem;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    /**
     * List Pharmacy Inventory
     */
    public function index(Request $request)
    {
        $query = PharmacyItem::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('low_stock')) {
            $query->whereColumn('stock', '<=', 'minimum_threshold');
        }

        $items = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'count' => $items->count(),
            'data' => $items,
        ]);
    }

    /**
     * Update stock count
     */
    public function updateStock(Request $request, $id)
    {
        $item = PharmacyItem::findOrFail($id);

        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $item->stock = $validated['stock'];
        $item->save();

        return response()->json([
            'success' => true,
            'message' => "Tirada daawada {$item->name} waa la cusbooneysiiyey ({$item->stock}).",
            'data' => $item,
        ]);
    }
}
