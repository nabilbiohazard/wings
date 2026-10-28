<?php
require __DIR__ . '/wordpress-commerce.php';

// Category rules must also hold for direct API requests.
foreach (array('necklace' => 'گردنبند', 'bracelet' => 'دستبند') as $kind => $label) {
    $GLOBALS['product_terms'][10] = array(
        (object) array('term_id'=>200,'name'=>$label,'slug'=>urlencode($label)),
        (object) array('term_id'=>201,'name'=>$label.'-تک-چارم','slug'=>urlencode($label.'-تک-چارم')));
    $single = $design;
    $single['charms'] = array($design['charms'][0]);
    $anchor = $kind === 'necklace' ? array('x'=>300,'y'=>578,'rotation'=>0) : array('x'=>298,'y'=>472,'rotation'=>0);
    $single['charms'][0] = array_merge($single['charms'][0], $anchor);
    $clean = Wings_Designs::clean($single, $GLOBALS['products'][10], 1);
    check(count($clean['snapshot']['charms'])===1 && $clean['snapshot']['charms'][0]['x']===$anchor['x'], $kind.' single charm uses the fixed anchor');
    check(count($clean['snapshot']['product']['categories'])===2, $kind.' category data survives order snapshots');
    $multiple = $single; $multiple['charms'][] = array_merge($single['charms'][0], array('instanceId'=>'extra-charm'));
    rejected(function()use($multiple){Wings_Designs::clean($multiple, $GLOBALS['products'][10], 1);},400,$kind.' single charm rejects extra charms');
    $moved = $single; $moved['charms'][0]['y'] -= 30;
    rejected(function()use($moved){Wings_Designs::clean($moved, $GLOBALS['products'][10], 1);},409,$kind.' single charm rejects a forged placement');
    $GLOBALS['product_terms'][10] = array($GLOBALS['product_terms'][10][0]);
    check(count(Wings_Designs::clean($design, $GLOBALS['products'][10], 1)['snapshot']['charms'])===2, $kind.' ordinary category still supports multiple charms');
}
unset($GLOBALS['product_terms'][10]);
echo "\n".$passed." total WordPress checks passed.\n";
