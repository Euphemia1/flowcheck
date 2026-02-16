<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProcessApprovalController extends Controller
{
    public function index()
    {
        // For now, just show the dashboard view
        return view('dashboard');
    }
}
