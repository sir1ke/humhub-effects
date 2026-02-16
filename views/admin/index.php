<?php

use yii\widgets\ActiveForm;
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model gm\humhub\modules\effects\models\Configuration */

$this->title = Yii::t('EffectsModule.base', 'Effects Settings');
$this->params['breadcrumbs'][] = $this->title;

// Define available effects
$effectOptions = $model->getEffectOptions();

$effectsEnabledInputId = Html::getInputId($model, 'effectsEnabled');
$selectedEffectInputId = Html::getInputId($model, 'selectedEffect');
?>

<div class="card">
    <div class="card-header">
        <?= Html::encode($this->title) ?>
    </div>
    <div class="card-body">
        <?php if (Yii::$app->session->hasFlash('success')): ?>
            <div class="alert alert-success">
                <?= Yii::$app->session->getFlash('success') ?>
            </div>
        <?php endif; ?>

        <?php if (empty($effectOptions)): ?>
            <div class="alert alert-warning">
                <?= Yii::t('EffectsModule.base', 'No effect scripts were found in resources/js.') ?>
            </div>
        <?php endif; ?>

        <?php $form = ActiveForm::begin(); ?>

        <?= $form->field($model, 'effectsEnabled')->checkbox() ?>

        <?= $form->field($model, 'selectedEffect')->dropDownList($effectOptions, [
            'prompt' => Yii::t('EffectsModule.base', '- Select Effect -'),
            'disabled' => !$model->effectsEnabled || empty($effectOptions),
        ]) ?>

        <div class="mb-3">
            <?= Html::submitButton(
                Yii::t('EffectsModule.base', 'Save'),
                ['class' => 'btn btn-primary']
            ) ?>
        </div>

        <?php ActiveForm::end(); ?>
    </div>
</div>

<?php
$this->registerJs(<<<JS
(function() {
    var checkbox = document.getElementById('$effectsEnabledInputId');
    var select = document.getElementById('$selectedEffectInputId');
    if (!checkbox || !select) {
        return;
    }

    function syncSelectState() {
        var hasSelectableEffects = select.options.length > 1;
        select.disabled = !checkbox.checked || !hasSelectableEffects;
        select.required = checkbox.checked && hasSelectableEffects;
    }

    checkbox.addEventListener('change', syncSelectState);
    syncSelectState();
})();
JS);
?>
