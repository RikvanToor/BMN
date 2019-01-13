<?php

namespace App\Http\Controllers;

use App\Models\Stageplan\Channel;
use App\Models\Stageplan\Stageplan;
use App\Models\Stageplan\StagePosition;
use App\Models\Stageplan\StageElement;
use App\Models\Stageplan\StageRoles;
use Illuminate\Http\Request;
use App\Http\ResponseCodes;
use DB;

class StageplanController extends Controller {
    
    public function addStageElements(Request $request, $stageplanId){
        $validatedData = $this->validate($request, [
            'elements.*.id' => 'string|required',
            'elements.*.name' => 'string|required',
            'elements.*.geometry' => 'string|required',
            'elements.*.type' => 'string|required'
        ]);
        $toInsert = array_map(function($el){
            return array('stage_id'=>$el['id'], 'name'=> $el['name'], 'geometry'=> $el['geometry'], 'type'=> $el['type']);
        }, $validatedData);
        //Bulk insert
        StageElement::insert($toInsert);

        return response()->json($toInsert,ResponseCodes::HTTP_CREATED);
    }

    public function deleteElement(Request $request, $stageplanId, $elementId){
        StageElement::destroy($elementId);
        $stageplan = Stageplan::findOrFail($stageplanId);
        $oldOrder = $stageplan->element_order;
        if (($key = array_search($elementId, $oldOrder)) !== false) {
            unset($oldOrder[$key]);
            $stageplan->element_order = $oldOrder;
            $stageplan->save();
        }
        return response()->json(array('msg'=>'Deleted '.$elementId.' '), ResponseCodes::HTTP_OK);
    }

    public function addStageElement(Request $request, $stageplanId){
        $stageplan = Stageplan::findOrFail($stageplanId);
        $validatedData = $this->validate($request, [
            'element.name' => 'string|required',
            'element.geometry' => 'string|required',
            'element.type' => 'string|required'
        ]);
        $element = new StageElement($validatedData['element']);
        $stageplan->elements()->save($element);

        return response()->json($element,ResponseCodes::HTTP_CREATED);
    }

    public function updateOrder(Request $request, $stageplanId){
        $stageplan = Stageplan::findOrFail($stageplanId);
        $data = $this->validate($request,[
            'order' => 'array|required',
            'order.*' => 'integer'
        ]);
        $stageplan->element_order = $data['order'];
        $stageplan->save();
        return response()->json($stageplan, ResponseCodes::HTTP_OK);

    }

    public function updateGeometries(Request $request, $stageplanId){
        $validatedData = $this->validate($request, [
            'elements.*.id' => 'string|required',
            'elements.*.geometry' => 'string|required'
        ]);
        //TODO
        foreach($validatedData['elements'] as $val){
            StageElement::where('id',$val['id'])->update(['geometry'=>$val['geometry']]);
        }
        return response()->json($validatedData['elements'], ResponseCodes::HTTP_CREATED);
    }

    public function getLatestStageplan(Request $request){
        $stageplan = Stageplan::with(['channels','roles','positions','elements'])->orderBy('updated_at','desc')->limit(1)->get();
        if(count($stageplan) == 1){
            return response()->json($stageplan[0], ResponseCodes::HTTP_OK);
        }
        return response()->json(array('msg'=>'Geen stageplans gevonden'), ResponseCodes::HTTP_NOT_FOUND);
    }
    public function getStageplan(Request $request, $id){
        $stageplan = Stageplan::findOrFail($id)->with(['channels','roles','positions','elements'])->get();
        return response()->json($stageplan, ResponseCodes::HTTP_OK);
    }

    public function getStageplans(Request $request){
        $plans = Stageplan::all()->select(['id','name','year'])->get();
        return response()->json($plans, ResponseCodes::HTTP_OK);
    }
}