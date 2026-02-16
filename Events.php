<?php

namespace gm\humhub\modules\effects;

use Yii;

class Events
{
    /**
     * Adds the effects widget to layout addons.
     */
    public static function onLayoutAddonsInit($event)
    {
        $event->sender->addWidget(widgets\Effects::class);
    }
}
